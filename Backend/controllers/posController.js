import PosOrder from "../models/PosOrder.js";
import Product from "../models/Product.js"; 

// @desc    جلب جميع عمليات البيع المسجلة من نقطة البيع
// @route   GET /api/pos-orders
export const getPosOrders = async (req, res) => {
  try {
    const orders = await PosOrder.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    تأكيد وتسجيل عملية بيع جديدة من واجهة POS وتحديث المخزون
// @route   POST /api/pos-orders
export const createPosOrder = async (req, res) => {
  try {
    const { customer, cart, payment, paid, total, remaining } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, message: "السلة فارغة" });
    }

    // 1. المرور على كل منتج في السلة وخصم الكمية من حقل stock في جدول المنتجات
    for (const item of cart) {
      const product = await Product.findById(item.id);
      if (!product) {
        return res.status(404).json({ success: false, message: `المنتج غير موجود: ${item.name}` });
      }

      // التحقق من أن المخزون يكفي
      if (product.stock < item.qty) {
        return res.status(400).json({ 
          success: false, 
          message: `الكمية غير متاحة للمنتج "${product.name}". المتبقي في المخزون: ${product.stock}` 
        });
      }

      // خصم الكمية المباعة من المخزون
      product.stock -= item.qty;

      // إذا نفد المخزون، يمكن تحديث حالة التوفر اختيارياً
      if (product.stock <= 0) {
        product.stock = 0;
        product.available = false;
      }

      await product.save(); // حفظ التحديث في قاعدة البيانات
    }

    // 2. حفظ فاتورة البيع في جدول PosOrder
    const order = await PosOrder.create({
      customer: {
        name: customer?.name || "",
        phone: customer?.phone || "",
      },
      cart,
      payment: payment || "نقدي",
      total: Number(total) || 0,
      paid: Number(paid) || 0,
      remaining: Number(remaining) || 0,
    });

    res.status(201).json({ 
      success: true, 
      message: "تم إتمام البيع وتحديث المخزون في قاعدة البيانات بنجاح", 
      data: order 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    حذف عملية بيع
// @route   DELETE /api/pos-orders/:id
export const deletePosOrder = async (req, res) => {
  try {
    const order = await PosOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "عملية البيع غير موجودة" });
    }

    await order.deleteOne();
    res.status(200).json({ success: true, message: "تم حذف عملية البيع بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import OrderManagement from "../models/OrderManagement.js";
import Product from "../models/Product.js";

// @desc    جلب جميع الطلبات (مع إمكانية الفلترة بالحالة أو البحث)
// @route   GET /api/orders-management
export const getOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== "الكل") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search,$options: "i" } },
        { "customer.name": { $regex: search,$options: "i" } },
      ];
    }

    const orders = await OrderManagement.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    إنشاء طلب جديد (بدون خصم المخزون لحين تأكيده)
// @route   POST /api/orders-management
export const createOrder = async (req, res) => {
  try {
    const { orderNumber, customer, items, total, discount, paid, status, date } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "لا توجد منتجات في الطلب" });
    }

    const totalNum = Number(total) || 0;
    const paidNum = Number(paid) || 0;
    const discountNum = Number(discount) || 0;
    const remaining = totalNum - paidNum - discountNum;

    // حفظ الطلب في قاعدة البيانات بحالة "جديد" دون المساس بالمخزون
    const order = await OrderManagement.create({
      orderNumber: orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
      customer,
      items,
      itemsCount: items.reduce((acc, item) => acc + item.qty, 0),
      total: totalNum,
      discount: discountNum,
      paid: paidNum,
      remaining: remaining > 0 ? remaining : 0,
      status: status || "جديد",
      date: date || new Date().toISOString().split("T")[0],
    });

    res.status(201).json({ success: true, message: "تم تسجيل الطلب وإرساله بنجاح", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    تحديث حالة الطلب (عند تغييرها إلى "تم التأكيد" يتم خصم المخزون تلقائياً)
// @route   PUT /api/orders-management/:id
export const updateOrder = async (req, res) => {
  try {
    let order = await OrderManagement.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "الطلب غير موجود" });
    }

    const { status: newStatus, ...otherUpdates } = req.body;

    const wasPending = order.status === "جديد";
    const isNowConfirmed = newStatus === "تم التأكيد" || newStatus === "قيد التجهيز";

    // إذا تحول الطلب من جديد إلى مؤكد، نقوم بخصم المخزون الآن (مع التأكد من وجود مصفوفة items)
    if (wasPending && isNowConfirmed && Array.isArray(order.items) && order.items.length > 0) {
      for (const item of order.items) {
        const product = await Product.findById(item.productId || item.id);
        if (product) {
          if (product.stock < item.qty) {
            return res.status(400).json({ 
              success: false, 
              message: `عذراً، لا يمكن تأكيد الطلب لأن المخزون غير كافٍ للمنتج: "${product.name}" (المتبقي: ${product.stock})` 
            });
          }
          product.stock -= item.qty;
          if (product.stock <= 0) {
            product.stock = 0;
            product.available = false;
          }
          await product.save();
        }
      }
    }

    const updatedData = { 
      ...(newStatus && { status: newStatus }), 
      ...otherUpdates 
    };
    
    if (updatedData.total !== undefined || updatedData.paid !== undefined || updatedData.discount !== undefined) {
      const total = updatedData.total !== undefined ? Number(updatedData.total) : order.total;
      const paid = updatedData.paid !== undefined ? Number(updatedData.paid) : order.paid;
      const discount = updatedData.discount !== undefined ? Number(updatedData.discount) : order.discount;
      updatedData.remaining = Math.max(0, total - paid - discount);
    }

    order = await OrderManagement.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: "تم تحديث الطلب بنجاح", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    حذف طلب
// @route   DELETE /api/orders-management/:id
export const deleteOrder = async (req, res) => {
  try {
    const order = await OrderManagement.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "الطلب غير موجود" });
    }

    await order.deleteOne();
    res.status(200).json({ success: true, message: "تم حذف الطلب بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    جلب طلب واحد بواسطة الـ ID
// @route   GET /api/orders-management/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await OrderManagement.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "الطلب غير موجود" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
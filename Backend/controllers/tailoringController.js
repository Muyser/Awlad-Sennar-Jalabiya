import TailoringManagement from "../models/TailoringManagement.js";

// @desc    جلب جميع طلبات التفصيل (مع إمكانية الفلترة بالحالة أو البحث)
// @route   GET /api/tailoring
export const getTailoringOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== "الكل") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search,$options: "i" } },
        { "customer.name": { $regex: search,$options: "i" } },
      ];
    }

    const orders = await TailoringManagement.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    إنشاء طلب تفصيل جديد
// @route   POST /api/tailoring
export const createTailoringOrder = async (req, res) => {
  try {
    const { orderId, customer, type, fabric, color, delivery, total, paid, status, measurements, notes } = req.body;

    const totalNum = Number(total) || 0;
    const paidNum = Number(paid) || 0;
    const remaining = totalNum - paidNum;

    const tailoringOrder = await TailoringManagement.create({
      orderId: orderId || `TAIL-${Date.now().toString().slice(-6)}`,
      customer,
      type,
      fabric,
      color,
      measurements: measurements || {}, // حفظ المقاسات
      notes: notes || "",               // حفظ الملاحظات
      delivery: delivery || new Date().toISOString().split("T")[0],
      total: totalNum,
      paid: paidNum,
      remaining: remaining > 0 ? remaining : 0,
      status: status || "جديد",
    });

    res.status(201).json({ success: true, message: "تم تسجيل طلب التفصيل بنجاح", data: tailoringOrder });
  } catch (error) {
    console.error("Error creating tailoring order:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    تحديث حالة طلب التفصيل أو بياناته
// @route   PUT /api/tailoring/:id
export const updateTailoringOrder = async (req, res) => {
  try {
    let order = await TailoringManagement.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "طلب التفصيل غير موجود" });
    }

    const updatedData = req.body;

    // إعادة حساب المبلغ المتبقي تلقائياً في حال تعديل الإجمالي أو المدفوع
    if (updatedData.total !== undefined || updatedData.paid !== undefined) {
      const total = updatedData.total !== undefined ? Number(updatedData.total) : order.total;
      const paid = updatedData.paid !== undefined ? Number(updatedData.paid) : order.paid;
      updatedData.remaining = Math.max(0, total - paid);
    }

    order = await TailoringManagement.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: "تم تحديث طلب التفصيل بنجاح", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    حذف طلب تفصيل
// @route   DELETE /api/tailoring/:id
export const deleteTailoringOrder = async (req, res) => {
  try {
    const order = await TailoringManagement.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "طلب التفصيل غير موجود" });
    }

    await order.deleteOne();
    res.status(200).json({ success: true, message: "تم حذف طلب التفصيل بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
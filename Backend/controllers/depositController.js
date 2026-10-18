import Deposit from "../models/Deposit.js";

// @desc    جلب جميع الإيداعات والسحوبات
// @route   GET /api/deposits
export const getDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: deposits.length, data: deposits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    إضافة إيداع أو سحب جديد
// @route   POST /api/deposits
export const createDeposit = async (req, res) => {
  try {
    const { recipient, person, amount, method, date, notes } = req.body;

    const deposit = await Deposit.create({
      recipient,
      person: person || "",
      amount,
      method: method || "كاش",
      date: date || new Date().toISOString().split("T")[0],
      notes: notes || "",
    });

    res.status(201).json({ success: true, message: "تم إضافة السجل بنجاح", data: deposit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    تعديل إيداع أو سحب
// @route   PUT /api/deposits/:id
export const updateDeposit = async (req, res) => {
  try {
    let deposit = await Deposit.findById(req.params.id);
    if (!deposit) {
      return res.status(404).json({ success: false, message: "السجل غير موجود" });
    }

    const { recipient, person, amount, method, date, notes } = req.body;

    if (recipient) deposit.recipient = recipient;
    if (person !== undefined) deposit.person = person;
    if (amount !== undefined) deposit.amount = amount;
    if (method) deposit.method = method;
    if (date) deposit.date = date;
    if (notes !== undefined) deposit.notes = notes;

    const updatedDeposit = await deposit.save();

    res.status(200).json({ 
      success: true, 
      message: "تم تحديث السجل بنجاح", 
      data: updatedDeposit 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    حذف إيداع أو سحب
// @route   DELETE /api/deposits/:id
export const deleteDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);
    if (!deposit) {
      return res.status(404).json({ success: false, message: "السجل غير موجود" });
    }

    await deposit.deleteOne();
    res.status(200).json({ success: true, message: "تم حذف السجل بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import Expense from "../models/Expense.js";

// @desc    جلب جميع المصروفات
// @route   GET /api/expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    إضافة مصروف جديد
// @route   POST /api/expenses
export const createExpense = async (req, res) => {
  try {
    const { type, amount, date, notes } = req.body;

    const expense = await Expense.create({
      type,
      amount,
      date: date || new Date().toISOString().split("T")[0],
      notes: notes || "",
    });

    res.status(201).json({ success: true, message: "تم إضافة المصروف بنجاح", data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    تعديل مصروف
// @route   PUT /api/expenses/:id
export const updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: "المصروف غير موجود" });
    }

    const { type, amount, date, notes } = req.body;

    if (type) expense.type = type;
    if (amount !== undefined) expense.amount = amount;
    if (date) expense.date = date;
    if (notes !== undefined) expense.notes = notes;

    const updatedExpense = await expense.save();

    res.status(200).json({ 
      success: true, 
      message: "تم تحديث المصروف بنجاح", 
      data: updatedExpense 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    حذف مصروف
// @route   DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: "المصروف غير موجود" });
    }

    await expense.deleteOne();
    res.status(200).json({ success: true, message: "تم حذف المصروف بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
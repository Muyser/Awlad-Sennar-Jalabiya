import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "نوع المصروف مطلوب"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "مبلغ المصروف مطلوب"],
    },
    date: {
      type: String,
      required: [true, "تاريخ المصروف مطلوب"],
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
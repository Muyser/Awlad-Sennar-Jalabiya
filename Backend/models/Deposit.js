import mongoose from "mongoose";

const depositSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: [true, "اسم المستلم مطلوب"],
      trim: true,
    },
    person: {
      type: String,
      default: "",
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "المبلغ مطلوب"],
    },
    method: {
      type: String,
      default: "كاش",
      trim: true,
    },
    date: {
      type: String,
      required: [true, "التاريخ مطلوب"],
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

const Deposit = mongoose.model("Deposit", depositSchema);

export default Deposit;
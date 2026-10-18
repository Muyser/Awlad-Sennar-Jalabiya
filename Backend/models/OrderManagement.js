import mongoose from "mongoose";

const orderManagementSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customer: {
      name: {
        type: String,
        required: [true, "اسم العميل مطلوب"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "رقم الهاتف مطلوب"],
        trim: true,
      },
    },
    itemsCount: {
      type: Number,
      required: true,
      default: 1,
    },
    total: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Number,
      required: true,
    },
    remaining: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["جديد", "تم التأكيد", "قيد التجهيز", "جاهز", "تم التسليم"],
      default: "جديد",
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrderManagement = mongoose.model("OrderManagement", orderManagementSchema);

export default OrderManagement;
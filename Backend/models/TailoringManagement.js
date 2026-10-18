import mongoose from "mongoose";

const tailoringSchema = new mongoose.Schema(
  {
    orderId: {
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
    type: {
      type: String,
      required: [true, "نوع الجلابية مطلوب"],
      trim: true,
    },
    fabric: {
      type: String,
      required: [true, "نوع القماش مطلوب"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "لون القماش مطلوب"],
      trim: true,
    },
    // أضفنا حقل المقاسات هنا ليتطابق مع ما يتم إرساله من الواجهة الأمامية
    measurements: {
      chest: { type: String, trim: true },
      length: { type: String, trim: true },
      sleeve: { type: String, trim: true },
      shoulder: { type: String, trim: true },
    },
    // أضفنا حقل الملاحظات هنا
    notes: {
      type: String,
      trim: true,
    },
    delivery: {
      type: String,
      required: [true, "تاريخ التسليم مطلوب"],
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    paid: {
      type: Number,
      required: true,
      default: 0,
    },
    remaining: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["جديد", "أخذ المقاسات", "قيد التفصيل", "جاهز", "تم التسليم"],
      default: "جديد",
    },
  },
  {
    timestamps: true,
  }
);

const TailoringManagement = mongoose.model("TailoringManagement", tailoringSchema);

export default TailoringManagement;
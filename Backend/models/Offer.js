import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم العرض مطلوب"],
      trim: true,
    },
    // ربط العرض بجدول المنتجات مباشرة
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "المنتج المستهدف مطلوب"],
    },
    type: {
      type: String,
      enum: ["نسبة مئوية", "مبلغ ثابت"],
      default: "نسبة مئوية",
    },
    value: {
      type: String,
      required: [true, "قيمة الخصم مطلوبة"],
      trim: true,
    },
    start: {
      type: String,
      required: [true, "تاريخ البداية مطلوب"],
    },
    end: {
      type: String,
      required: [true, "تاريخ النهاية مطلوب"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم المنتج مطلوب"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "قسم المنتج مطلوب"],
      enum: [
        "جلاليب سودانية",
        "جلاليب خليجية",
        "جلاليب تشادية",
        "جانفو",
        "لبسات أفريقية",
        "عمم",
        "شالات",
        "طواقي",
        "أحذية",
        "عطور",
        "سديري",
        "سراويل",
        "أخرى"
      ],
      trim: true,
    },
    type: {
      type: String,
      enum: ["جاهز", "تفصيل"],
      default: "جاهز",
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "سعر المنتج مطلوب"],
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    images: {
      type: [String], // مصفوفة لروابط الصور المتعددة
      required: [true, "يجب إضافة صورة واحدة على الأقل للمنتج"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
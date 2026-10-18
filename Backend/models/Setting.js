import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      default: "أولاد سنار جلابية",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    whatsapp: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    currency: {
      type: String,
      default: "ج.س (جنيه سوداني)",
      trim: true,
    },
    facebook: {
      type: String,
      default: "",
      trim: true,
    },
    instagram: {
      type: String,
      default: "",
      trim: true,
    },
    activityType: {
      type: String,
      default: "بيع وتفصيل جلاليب وملابس",
      trim: true,
    },
    commercialRecord: {
      type: String,
      default: "",
      trim: true,
    },
    defaultOrderStatus: {
      type: String,
      default: "جديد",
      trim: true,
    },
    prepDays: {
      type: Number,
      default: 3,
    },
    tailoringDays: {
      type: Number,
      default: 14,
    },
    minDeposit: {
      type: Number,
      default: 50,
    },
    notifications: {
      newOrder: { type: Boolean, default: true },
      newTailoringOrder: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      newPayment: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
  size: {
    type: String,
    default: "",
    trim: true,
  },
});

const posOrderSchema = new mongoose.Schema(
  {
    customer: {
      name: {
        type: String,
        default: "",
        trim: true,
      },
      phone: {
        type: String,
        default: "",
        trim: true,
      },
    },
    cart: [cartItemSchema],
    payment: {
      type: String,
      enum: ["نقدي", "تحويل", "آجل"],
      default: "نقدي",
    },
    total: {
      type: Number,
      required: true,
    },
    paid: {
      type: Number,
      required: true,
    },
    remaining: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PosOrder = mongoose.model("PosOrder", posOrderSchema);

export default PosOrder;
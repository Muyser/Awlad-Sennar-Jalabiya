import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم القسم مطلوب"],
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "صورة القسم مطلوبة"],
    },
    count: {
      type: Number,
      default: 1,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
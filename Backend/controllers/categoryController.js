import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// دالة مساعدة لرفع الصور إلى Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: "sennar-jallabia/categories" },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// @desc    جلب جميع الأقسام
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    إنشاء قسم جديد مع رفع الصورة
// @route   POST /api/categories
// @access  Admin
export const createCategory = async (req, res) => {
  try {
    const { name, count, visible } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "صورة القسم مطلوبة" });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const category = await Category.create({
      name,
      image: imageUrl,
      count: Number(count) || 1,
      visible: visible !== undefined ? (visible === "true" || visible === true) : true,
    });

    res.status(201).json({ success: true, message: "تم إنشاء القسم بنجاح", data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    تعديل قسم
// @route   PUT /api/categories/:id
// @access  Admin
export const updateCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "القسم غير موجود" });
    }

    let imageUrl = category.image;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const { name, count, visible } = req.body;

    category.name = name || category.name;
    category.image = imageUrl;
    category.count = count !== undefined ? Number(count) : category.count;
    category.visible = visible !== undefined ? (visible === "true" || visible === true) : category.visible;

    const updatedCategory = await category.save();

    res.status(200).json({ success: true, message: "تم تحديث القسم بنجاح", data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    حذف قسم
// @route   DELETE /api/categories/:id
// @access  Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "القسم غير موجود" });
    }

    await category.deleteOne();
    res.status(200).json({ success: true, message: "تم حذف القسم بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
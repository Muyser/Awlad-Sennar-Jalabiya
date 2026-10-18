import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// دالة مساعدة لرفع الصور من الذاكرة (Buffer) إلى Cloudinary مباشرة
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: "sennar-jallabia/products" },
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

// @desc    جلب جميع المنتجات
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    جلب منتج واحد بواسطة الـ ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "المنتج غير موجود" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    إنشاء منتج جديد مع رفع صور متعددة
// @route   POST /api/products
// @access  Admin
export const createProduct = async (req, res) => {
  try {
    const { name, category, type, description, price, stock, available, colors, sizes } = req.body;

    // التحقق من رفع صور للمنتج
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "يجب رفع صورة واحدة على الأقل للمنتج" });
    }

    // رفع جميع الصور المرفوعة إلى Cloudinary بالتوازي
    const imageUploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
    const imageUrls = await Promise.all(imageUploadPromises);

    // معالجة الألوان والمقاسات إذا كانت تأتي كنص مفصول بفواصل أو مصفوفة
    const parsedColors = typeof colors === "string" ? colors.split(",").map(c => c.trim()).filter(Boolean) : colors;
    const parsedSizes = typeof sizes === "string" ? sizes.split(",").map(s => s.trim()).filter(Boolean) : sizes;

    const product = await Product.create({
      name,
      category,
      type,
      description,
      price: Number(price),
      stock: Number(stock) || 0,
      available: available === "true" || available === true,
      colors: parsedColors || [],
      sizes: parsedSizes || [],
      images: imageUrls,
    });

    res.status(201).json({ success: true, message: "تم إنشاء المنتج بنجاح", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    تعديل منتج
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "المنتج غير موجود" });
    }

    let updatedImages = product.images;

    // إذا تم رفع صور جديدة، نقوم برفعها وتحديث القائمة
    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
      const newImageUrls = await Promise.all(imageUploadPromises);
      updatedImages = [...updatedImages, ...newImageUrls]; // أو استبدالها حسب رغبتك
    }

    const { name, category, type, description, price, stock, available, colors, sizes } = req.body;

    const parsedColors = typeof colors === "string" ? colors.split(",").map(c => c.trim()).filter(Boolean) : colors;
    const parsedSizes = typeof sizes === "string" ? sizes.split(",").map(s => s.trim()).filter(Boolean) : sizes;

    product.name = name || product.name;
    product.category = category || product.category;
    product.type = type || product.type;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.available = available !== undefined ? (available === "true" || available === true) : product.available;
    product.colors = parsedColors || product.colors;
    product.sizes = parsedSizes || product.sizes;
    product.images = updatedImages;

    const updatedProduct = await product.save();

    res.status(200).json({ success: true, message: "تم تحديث المنتج بنجاح", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    حذف منتج
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "المنتج غير موجود" });
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    تحديث مخزون وحالة المنتج
// @route   PATCH /api/products/:id/stock
// @access  Admin
export const updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;
    
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "المنتج غير موجود" });
    }

    const newStock = Number(stock);
    if (isNaN(newStock) || newStock < 0) {
      return res.status(400).json({ success: false, message: "قيمة المخزون غير صالحة" });
    }

    product.stock = newStock;
    product.available = newStock > 0 ? product.available : false;

    const updatedProduct = await product.save();

    res.status(200).json({ 
      success: true, 
      message: "تم تحديث المخزون بنجاح", 
      data: updatedProduct 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

export const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // التحقق من صحة الاتصال بمفاتيح Cloudinary عبر الـ API
    await cloudinary.api.ping();
    console.log("✅ Cloudinary storage engine connected successfully!");
  } catch (error) {
    console.error("❌ Cloudinary connection failed! Check your .env credentials.");
    console.error(error.message);
  }
};

// تهيئة Multer للتخزين المؤقت في الذاكرة (Memory Storage) لرفع الصور بسلاسة
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image file types are supported!"), false);
  }
};

export const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // الحد الأقصى 5 ميجابايت للصورة
});

export default cloudinary;
import express from "express";
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  updateProductStock
} from "../controllers/productController.js";
import { upload } from "../config/cloudinary.js";
import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🌐 مسارات جلب المنتجات (عامة للجميع - للزوار والعملاء)
router.get("/", getProducts);
router.get("/:id", getProductById);

// 🔒 مسارات لوحة التحكم (إضافة، تعديل، حذف، وتحديث المخزون - محمية للمدير فقط)
router.post("/", verifyTokenMiddleware, upload.array("images", 5), createProduct);
router.put("/:id", verifyTokenMiddleware, upload.array("images", 5), updateProduct);
router.delete("/:id", verifyTokenMiddleware, deleteProduct);
router.patch("/:id/stock", verifyTokenMiddleware, updateProductStock);

export default router;
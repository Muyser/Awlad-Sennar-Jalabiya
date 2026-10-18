import express from "express";
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../controllers/categoryController.js";
import { upload } from "../config/cloudinary.js";
import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", verifyTokenMiddleware, upload.single("image"), createCategory);
router.put("/:id", verifyTokenMiddleware, upload.single("image"), updateCategory);
router.delete("/:id", verifyTokenMiddleware, deleteCategory);

export default router;
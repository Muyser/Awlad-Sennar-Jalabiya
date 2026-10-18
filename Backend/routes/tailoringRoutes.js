import express from "express";
import { 
  getTailoringOrders, 
  createTailoringOrder, 
  updateTailoringOrder, 
  deleteTailoringOrder 
} from "../controllers/tailoringController.js";
import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// جلب جميع طلبات التفصيل (محمي - خاص بلوحة تحكم المدير)
router.get("/", verifyTokenMiddleware, getTailoringOrders);

// إنشاء طلب تفصيل جديد (يمكن جعله عاماً للعملا)
router.post("/", createTailoringOrder);

// تحديث وحذف طلبات التفصيل (محمي - للمدير فقط)
router.put("/:id", verifyTokenMiddleware, updateTailoringOrder);
router.delete("/:id", verifyTokenMiddleware, deleteTailoringOrder);

export default router;
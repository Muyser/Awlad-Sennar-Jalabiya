import express from "express";
import { 
  getOrders, 
  createOrder, 
  updateOrder, 
  deleteOrder,
  getOrderById
} from "../controllers/orderManagementController.js";
import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// جلب كل الطلبات (محمي - خاص بلوحة تحكم المدير)
router.get("/", verifyTokenMiddleware, getOrders);

// إنشاء طلب جديد (عام - متاح للزوار والعملاء عند الشراء من المتجر)
router.post("/", createOrder);

// جلب طلب واحد بالـ ID (محمي - خاص بلوحة تحكم المدير)
router.get("/:id", verifyTokenMiddleware, getOrderById);

// تحديث حالة الطلب (محمي - للمدير فقط)
router.put("/:id", verifyTokenMiddleware, updateOrder);

// حذف الطلب (محمي - للمدير فقط)
router.delete("/:id", verifyTokenMiddleware, deleteOrder);

export default router;
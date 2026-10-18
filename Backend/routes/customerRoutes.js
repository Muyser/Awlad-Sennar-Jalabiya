import express from "express";
import { 
  getCustomers, 
  createCustomer, 
  getCustomerById,
  updateCustomer, 
  deleteCustomer 
} from "../controllers/customerController.js";
import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// جلب كل العملاء (محمي - خاص بالمدير في لوحة التحكم)
router.get("/", verifyTokenMiddleware, getCustomers);

// إضافة عميل جديد (محمي - خاص بالمدير)
router.post("/", verifyTokenMiddleware, createCustomer);

// جلب عميل معين بواسطة الـ ID (محمي - خاص بالمدير)
router.get("/:id", verifyTokenMiddleware, getCustomerById);

// تعديل بيانات عميل (محمي - خاص بالمدير)
router.put("/:id", verifyTokenMiddleware, updateCustomer);

// حذف عميل (محمي - خاص بالمدير)
router.delete("/:id", verifyTokenMiddleware, deleteCustomer);

export default router;
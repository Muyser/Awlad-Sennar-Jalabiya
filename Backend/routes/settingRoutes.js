import express from "express";
import { 
  getSettings, 
  updateSettings 
} from "../controllers/settingController.js";
import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// جلب الإعدادات (عامة - ليتمكن الزوار من رؤية تفاصيل وعناوين المتجر)
router.get("/", verifyTokenMiddleware, getSettings);

// تحديث الإعدادات (محمي - خاص بالمدير فقط من لوحة التحكم)
router.put("/", verifyTokenMiddleware, updateSettings);

export default router;
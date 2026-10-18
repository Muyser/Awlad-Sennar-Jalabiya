import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// مسار لوحة التحكم (محمي بالكامل - خاص بالمدير فقط)
router.get("/", verifyTokenMiddleware, getDashboardData);

export default router;
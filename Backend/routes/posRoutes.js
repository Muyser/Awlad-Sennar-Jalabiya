import express from "express";
import { 
  getPosOrders, 
  createPosOrder, 
  deletePosOrder 
} from "../controllers/posController.js";
import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// جميع مسارات نقطة البيع محمية بالكامل وتتطلب توكن المصادقة
router.get("/", verifyTokenMiddleware, getPosOrders);
router.post("/", verifyTokenMiddleware, createPosOrder);
router.delete("/:id", verifyTokenMiddleware, deletePosOrder);

export default router;
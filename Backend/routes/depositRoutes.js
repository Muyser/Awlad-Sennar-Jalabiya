import express from "express";
import { 
  getDeposits, 
  createDeposit, 
  updateDeposit, 
  deleteDeposit 
} from "../controllers/depositController.js";
import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// جميع مسارات الإيداعات محمية وتتطلب توكن المدير (Admin)
router.get("/", verifyTokenMiddleware, getDeposits);
router.post("/", verifyTokenMiddleware, createDeposit);
router.put("/:id", verifyTokenMiddleware, updateDeposit);
router.delete("/:id", verifyTokenMiddleware, deleteDeposit);

export default router;
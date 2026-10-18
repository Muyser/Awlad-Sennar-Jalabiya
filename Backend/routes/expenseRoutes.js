import express from "express";
import { 
  getExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense 
} from "../controllers/expenseController.js";
import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// جميع مسارات المصروفات محمية بالكامل للمدير فقط
router.get("/", verifyTokenMiddleware, getExpenses);
router.post("/", verifyTokenMiddleware, createExpense);
router.put("/:id", verifyTokenMiddleware, updateExpense);
router.delete("/:id", verifyTokenMiddleware, deleteExpense);

export default router;
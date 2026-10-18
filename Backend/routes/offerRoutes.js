import express from "express";
import { 
  getOffers, 
  createOffer, 
  updateOffer, 
  deleteOffer 
} from "../controllers/offerController.js";
import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// جلب العروض (متاح للجميع لكي يتمكن الزوار من رؤيتها في المتجر)
router.get("/", getOffers);

// إدارة العروض (محمية بالكامل - خاصة بالمدير فقط)
router.post("/", verifyTokenMiddleware, createOffer);
router.put("/:id", verifyTokenMiddleware, updateOffer);
router.delete("/:id", verifyTokenMiddleware, deleteOffer);

export default router;
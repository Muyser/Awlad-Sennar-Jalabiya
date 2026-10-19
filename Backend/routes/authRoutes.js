import express from 'express';
import { 
  register,  
  login, 
  forgotPassword,
  changePassword,
  resetPassword,
  getMe
} from '../controllers/authController.js';
import { verifyTokenMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', verifyTokenMiddleware, getMe);
router.post('/change-password', verifyTokenMiddleware, changePassword);

export default router;
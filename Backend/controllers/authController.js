import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';

// 1. تسجيل حساب جديد (مباشر)
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "البريد الإلكتروني مسجل بالفعل" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      isVerified: true
    });

    await newUser.save();

    res.status(201).json({ message: "تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن" });
  } catch (err) {
    res.status(500).json({ message: err.message || "فشل إنشاء الحساب" });
  }
};

// 2. تسجيل الدخول للحصول على التوكن
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    const access_token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      message: "تم تسجيل الدخول بنجاح",
      access_token, 
      user: { email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "فشل تسجيل الدخول" });
  }
};

// 3. طلب استعادة كلمة المرور
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: "إذا كان البريد مسجلاً، فسيتم إرسال تعليمات الاستعادة." });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // صلاحية ساعة واحدة
    await user.save();

    // يظهر التوكن في الكونسول للاختبار
    console.log(`[Reset Password Token for ${email}]: ${resetToken}`);

    res.status(200).json({ message: "تم إرسال رابط الاستعادة بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message || "فشل إرسال رابط الاستعادة" });
  }
};

// 4. إعادة تعيين كلمة المرور باستخدام التوكن
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({
      resetToken,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "رابط إعادة التعيين غير صالح أو انتهت صلاحيته" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "تم تحديث كلمة المرور بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message || "فشل إعادة تعيين كلمة المرور" });
  }
};

// 5. تغيير كلمة المرور للمستخدم المسجل دخوله (محمي)
export const changePassword = async (req, res) => {
  try {
    const { userId } = req.user; 
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "كلمة المرور الحالية غير صحيحة" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message || "فشل تغيير كلمة المرور" });
  }
};

// 6. جلب بيانات المستخدم الحالي (محمي بالتوكن)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "المستخدم غير موجود" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "فشل جلب بيانات المستخدم" });
  }
};
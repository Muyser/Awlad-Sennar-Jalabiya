import jwt from 'jsonwebtoken';

export const verifyTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "غير مصرح، يرجى تسجيل الدخول" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded; // يحمل بيانات المستخدم مثل { userId, email }
    next();
  } catch (err) {
    return res.status(403).json({ message: "التوكن غير صالح أو انتهت صلاحيته" });
  }
};
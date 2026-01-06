const jwt = require('jsonwebtoken');

/**
 * Middleware kiểm tra JWT (dùng cho tất cả route cần đăng nhập)
 */
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  // Token chuẩn: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Token malformed" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // lưu thông tin user vào req.user
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

/**
 * Middleware kiểm tra quyền admin
 * Dùng sau middleware auth
 */
const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied: Admin only" });
  }

  next();
};

module.exports = { auth, adminOnly };

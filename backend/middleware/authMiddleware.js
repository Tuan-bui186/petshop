import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js"; 
import User from "../models/userModel.js"; 
// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Đọc JWT từ cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Giải mã token và lấy thông tin người dùng
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next(); 
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Không được phép, token không hợp lệ.");
    }
  } else {
    res.status(401); 
    throw new Error("Không được phép, không có token.");
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); 
  } else {
    res.status(401);
    throw new Error("Không được phép, bạn không phải là quản trị viên.");
  }
};

export { protect, admin }; 

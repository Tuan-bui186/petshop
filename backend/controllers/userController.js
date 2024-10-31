import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// Đăng nhập người dùng và lấy token
// POST /api/users/auth
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body; 
  const user = await User.findOne({ email });
  // Kiểm tra nếu người dùng tồn tại và mật khẩu hợp lệ
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id); 
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      shippingAddress: user.shippingAddress,
    });
  } else {
    res.status(401); 
    throw new Error("Email hoặc mật khẩu không đúng");
  }
});



// Đăng xuất người dùng
// POST /api/users/logout
const logoutUser = (req, res) => {
  res.clearCookie("jwt"); 
  res.status(200).send("Đăng xuất thành công");
};



// Đăng ký người dùng mới và lấy token
// POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); 
    throw new Error("Người dùng đã tồn tại");
  }
  // Tạo người dùng mới
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    generateToken(res, user._id); 
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Thông tin người dùng không hợp lệ");
  }
});



// Lấy danh sách người dùng
// GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}); 
  res.status(200).json(users); 
});



// Cập nhật thông tin người dùng
// PUT /api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); 
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    //Cập nhât mật khẩu
    if (req.body.password) {
      user.password = req.body.password;
    }
    // Cập nhật địa chỉ giao hàng
    user.shippingAddress = req.body.shippingAddress;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      shippingAddress: updatedUser.shippingAddress,
    });
  } else {
    res.status(404); 
    throw new Error("Không tìm thấy người dùng");
  }
});




// Cập nhật mật khẩu người dùng
// PUT /api/users/password
const updateUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    // Kiểm tra mật khẩu hiện tại
    if (await user.matchPassword(req.body.currentPassword)) {
      user.password = req.body.password; 
      await user.save();
      res.json({ message: "Cập nhật mật khẩu thành công" });
    } else {
      res.status(401); 
      throw new Error("Mật khẩu không đúng");
    }
  } else {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }
});



// Xóa người dùng
// DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id); 
  if (user) {
    if (user.isAdmin) {
      res.status(400); 
      throw new Error("Không thể xóa người dùng quản trị");
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "Xóa người dùng thành công" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }
});



// Lấy thông tin người dùng theo ID
// GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password"); 
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }
});


export {
  authUser,
  logoutUser,
  registerUser,
  getUsers,
  updateUserProfile,
  updateUserPassword,
  deleteUser,
  getUserById,
};

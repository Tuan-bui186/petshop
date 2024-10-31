import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// @desc    Tạo đơn hàng mới.
// @route   POST /api/orders
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("Không có sản phẩm");
    return;
  }



  // Tạo một đơn hàng mới
  const order = new Order({
    orderItems: orderItems.map((item) => ({
      ...item,
      product: item._id, // Thêm ID sản phẩm vào đơn hàng
      _id: undefined, // Xóa ID gốc để không bị trùng lặp
    })),
    user: req.user._id, // ID người dùng
    shippingAddress, // Địa chỉ giao hàng
    paymentMethod, // Phương thức thanh toán
    itemsPrice, // Tổng giá trị sản phẩm
    taxPrice, // Thuế
    shippingPrice, // Phí giao hàng
    totalPrice, // Tổng giá đơn hàng
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder); 
});



// @desc    Lấy đơn hàng từ người dùng đã đăng nhập.
// @route   GET /api/orders/mine
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1, 
  });
  res.json(orders); 
});



// @desc   Lấy đơn hàng theo ID người dùng.
// @route   GET /api/orders/user/:id
const getOrdersByUserId = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.id }).sort({
    createdAt: -1, 
  });
  res.json(orders); 
});


// @desc    Lấy đơn hàng theo ID.
// @route   GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json(order); 
  } else {
    res.status(404);
    throw new Error("Đơn hàng không tồn tại."); 
  }
});



// @desc    Cập nhật đơn hàng thành đã thanh toán.
// @route   PUT /api/orders/:id/pay
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true; // Đánh dấu đơn hàng đã được thanh toán
    order.paidAt = Date.now(); // Thời gian thanh toán
    order.paymentResult = { // Thông tin thanh toán
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save(); 
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Đơn hàng không tồn tại"); 
  }
});



// @desc    Cập nhật đơn hàng thành đã giao.
// @route   PUT /api/orders/:id/deliver
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true; // Đánh dấu đơn hàng đã được giao
    order.deliveredAt = Date.now(); // Thời gian giao hàng
    const updatedOrder = await order.save(); 
    res.json(updatedOrder); 
  } else {
    res.status(404);
    throw new Error("Đơn hàng không tồn tại"); 
  }
});



// @desc    Lấy tất cả đơn hàng
// @route   GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "id name") 
    .sort({ createdAt: -1 }); 
  res.json(orders); 
});


export {
  addOrderItems,
  getMyOrders,
  getOrdersByUserId,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};

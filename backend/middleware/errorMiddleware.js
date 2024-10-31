// Middleware để xử lý các route không tìm thấy
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404); 
  next(error); 
};

// Middleware để xử lý lỗi chung
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message; 

  // Kiểm tra nếu lỗi là lỗi CastError với ObjectId không hợp lệ
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Resource not found - invalid ObjectId"; 
    statusCode = 404; 
  }

  // Trả về phản hồi JSON với thông báo lỗi và thông tin ngăn xếp (stack trace)
  res.status(statusCode).json({
    message: message, 
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler }; 

import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Lấy danh sách sản phẩm
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  // Lấy kích thước trang và số trang từ query params
  const pageSize = req.query.pageSize || undefined;
  const page = Number(req.query.pageNumber) || 1;

  // Lấy các tham số tìm kiếm từ query params
  const {
    keyword: keywordQuery,
    isPublished,
    category,
    isPopular,
    isOnSale,
    sort: sortQuery,
  } = req.query;

  // Tạo đối tượng từ khóa tìm kiếm
  const keyword = {
    ...(keywordQuery && {
      name: {
        $regex: keywordQuery,
        $options: "i",
      },
    }),
    ...(isPublished && { isPublished }),
    ...(category && { category }),
    ...(isPopular && { isPopular }),
    ...(isOnSale && { isOnSale }),
  };

  // Các tùy chọn sắp xếp
  const sortOptions = {
    "createdAt:desc": { createdAt: -1 },
    "createdAt:asc": { createdAt: 1 },
    "price:desc": { price: -1 },
    "price:asc": { price: 1 },
  };

  // Mặc định sắp xếp theo ngày tạo giảm dần
  let sortParam = { createdAt: -1 };

  // Kiểm tra xem có tùy chọn sắp xếp hợp lệ không
  if (sortQuery && sortOptions[sortQuery]) {
    sortParam = sortOptions[sortQuery];
  }

  // Đếm số lượng sản phẩm phù hợp với từ khóa tìm kiếm
  const count = await Product.countDocuments({ ...keyword });
  // Tìm tất cả sản phẩm dựa trên từ khóa tìm kiếm, sắp xếp và phân trang
  const products = await Product.find({ ...keyword })
    .sort(sortParam)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Trả về danh sách sản phẩm, số trang và tổng số trang
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});



// @desc    Tạo mới 1 sản phẩm
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    countInStock,
    category,
    image,
    isPublished,
    isOnSale,
    salePrice,
    isPopular,
  } = req.body;

  const product = new Product({
    name,
    price,
    countInStock,
    category,
    description,
    image,
    isPublished,
    isOnSale,
    salePrice,
    isPopular,
  });

  const createdProduct = await product.save();
  res.send({
    message: "Sản phẩm đã được tạo thành công.",
    product: createdProduct,
  });
});



// @desc   Lấy một sản phẩm 
// @route   GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Sản phẩm không tồn tại");
  }
});


// @desc    chỉnh sửa 1 sản phẩm
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    countInStock,
    category,
    image,
    isPublished,
    isOnSale,
    salePrice,
    isPopular,
  } = req.body;

  const product =
    (await Product.findById(req.params.id)) ||
    new Product({
      _id: req.params.id,
    });

  product.name = name;
  product.price = price;
  product.description = description;
  product.countInStock = countInStock;
  product.category = category;
  product.image = image;
  product.isPublished = isPublished;
  product.isOnSale = isOnSale;
  product.salePrice = salePrice;
  product.isPopular = isPopular;

  const updatedProduct = await product.save();

  res.send({
    message: "Cập nhật sản phẩm thành công",
    product: updatedProduct,
  });
});



// @desc    Xóa 1 sản phẩm
// @route   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "Sản phẩm đã được xóa." });
  } else {
    res.status(404);
    throw new Error("Sản phẩm không tồn tại.");
  }
});


export {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};

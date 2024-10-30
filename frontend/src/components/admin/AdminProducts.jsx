import { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { FaRegEdit, FaCheck } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import ProductModal from "./ProductModal";
import ImageContainer from "../ImageContainer";
import SaleTag from "../SaleTag";
import PopularTag from "../PopularTag";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import { toast } from "react-toastify";

const AdminProducts = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const closeCreateModalHandler = () => setShowCreateModal(false);
  const showCreateModalHandler = () => setShowCreateModal(true);

  const closeEditModalHandler = () => setShowEditModal(false);
  const showEditModalHandler = () => setShowEditModal(true);

  const { data, refetch, isLoading, error } = useGetProductsQuery({
    keyword: "",
    pageNumber: 1,
  });

  const [deleteProduct] = useDeleteProductMutation();

  const clickEditBtnHandler = (product) => {
    setSelectedProduct(product);
    showEditModalHandler();
  };

  const deleteProductHandler = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(id);
        toast.success("Sản phẩm đã được xóa thành công");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center py-3">
        <Button
          className="btn btn-primary ms-auto rounded-pill px-4"
          onClick={showCreateModalHandler}
        >
          Tạo Sản Phẩm
        </Button>
      </div>
      {isLoading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>Lỗi: {error?.data?.message || error.error}</p>
      ) : data?.products.length === 0 ? (
        <p>Không tìm thấy sản phẩm</p>
      ) : (
        <Table striped hover responsive className="table-style">
          <thead>
            <tr>
              <th>Hình Ảnh</th>
              <th>Tên Sản Phẩm</th>
              <th>Giá</th>
              <th>Thẻ</th>
              <th>Còn Hàng</th>
              <th>Danh Mục</th>
              <th>Xuất Bản</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {data?.products.map((product) => (
              <tr key={product._id}>
                <td>
                  <ImageContainer
                    src={product.image}
                    size="100px"
                    alt={product.name}
                    borderRadius="4px"
                  />
                </td>
                <td>
                  <p className="fw-bold mb-0">{product.name}</p>
                  <small className="text-secondary">{`ID: ${product._id}`}</small>
                </td>
                <td>
                  {product.isOnSale ? (
                    <span>
                      <span className="text-decoration-line-through text-black-50">
                        ${product.price}
                      </span>
                      <span className="ms-2">${product.salePrice}</span>
                    </span>
                  ) : (
                    <span>${product.price}</span>
                  )}
                </td>
                <td>
                  <div className="gap-1 d-flex">
                    {product.isOnSale && <SaleTag />}
                    {product.isPopular && <PopularTag />}
                  </div>
                </td>
                <td>{product.countInStock}</td>
                <td className="text-capitalize">{product.category}</td>
                <td>
                  {product.isPublished && <FaCheck className="text-success" />}
                </td>
                <td className="text-nowrap">
                  <Button
                    size="sm"
                    variant="light"
                    className="me-2"
                    onClick={() => clickEditBtnHandler(product)}
                  >
                    <FaRegEdit />
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    className="text-primary"
                    onClick={() => deleteProductHandler(product._id)}
                  >
                    <RiDeleteBin6Line />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Tạo Sản Phẩm */}
      <ProductModal
        show={showCreateModal}
        isCreate
        onHide={closeCreateModalHandler}
      />

      {/* Chỉnh Sửa Sản Phẩm */}
      <ProductModal
        show={showEditModal}
        product={selectedProduct}
        onHide={closeEditModalHandler}
      />
    </div>
  );
};

export default AdminProducts;

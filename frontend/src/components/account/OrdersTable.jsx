import { Table } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const OrdersTable = ({ isInAdmin, orders, isLoading, error }) => {
  return (
    <>
      <h6 className="fw-bold text-primary">Lịch sử mua hàng</h6>

      {isLoading ? (
        <p>Đang tải lịch sử mua hàng...</p>
      ) : error ? (
        <p>Lỗi: {error?.data?.message || error.error}</p>
      ) : orders?.length === 0 ? (
        <p>Không tìm thấy lịch sử mua hàng.</p>
      ) : (
        <Table striped hover responsive className="table-style">
          <thead>
            <tr>
              <th>ID</th>
              <th>NGÀY</th>
              <th>TỔNG CỘNG</th>
              <th>ĐÃ THANH TOÁN</th>
              <th>ĐÃ GIAO</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes className="text-primary" />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes className="text-primary" />
                  )}
                </td>
                <td>
                  <Link
                    to={
                      isInAdmin
                        ? `/admin/orders/${order._id}`
                        : `/account/order/${order._id}`
                    }
                    className="text-primary"
                  >
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrdersTable;

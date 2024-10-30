import { Table } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";

const AdminOrders = () => {
  const { data: orders, error, isLoading } = useGetOrdersQuery();

  return (
    <div className="mt-3">
      {isLoading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : !orders || orders.length === 0 ? (
        <p>Không tìm thấy đơn hàng nào.</p>
      ) : (
        orders.length > 0 && (
          <Table striped hover responsive className="table-style">
            <thead>
              <tr>
                <th>ID đơn hàng</th>
                <th>Người dùng</th>
                <th>Thời gian</th>
                <th>Tổng</th>
                <th>Thanh toán</th>
                <th>Giao hàng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
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
                    <Link to={`/admin/orders/${order._id}`} className="text-primary">
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )
      )}
    </div>
  );
};

export default AdminOrders;

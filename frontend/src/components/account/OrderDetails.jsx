import { Link, useLocation, useParams } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import ImageContainer from "../ImageContainer";
import { Row, Col, Table, Card, Button } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import PayPalPayment from "../order/PayPalPayment";
import { useSelector } from "react-redux";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from "../../slices/ordersApiSlice";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orderId } = useParams();

  const location = useLocation();

  const { userInfo } = useSelector((state) => state.auth);

  const segments = location.pathname.split("/");
  const slicedPath = segments[1];

  const isInAdmin = slicedPath === "admin" && userInfo.isAdmin;

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const isNotAuthorized =
    !isLoading && order?.user?._id !== userInfo._id && !isInAdmin;

  const isAuthorized =
    !isLoading && order && (order?.user?._id === userInfo._id || isInAdmin);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const payHandler = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn đánh dấu đơn hàng này là đã thanh toán không?")) {
      return;
    }

    try {
      await payOrder({ orderId, details: { payer: {} } });
      refetch();
      toast.success("Đơn hàng đã được thanh toán");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const deliverHandler = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn đánh dấu đơn hàng này là đã giao không?")) {
      return;
    }

    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Đơn hàng đã được giao");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const onPaidHandler = () => {
    refetch();
  };

  const isShowPayPalBtn = order && !order.isPaid && !isInAdmin;

  return (
    <div className="order-details">
      {isInAdmin ? (
        <h6 className="fw-bold text-primary mt-3">
          <Link to="/admin/orders" className="text-primary back-link fs-5 me-1">
            <FaAngleLeft />
          </Link>
          Chi tiết đơn hàng
        </h6>
      ) : (
        <h6 className="fw-bold text-primary">
          <Link to="/account" className="text-primary back-link">
            Lịch sử mua hàng
          </Link>
          <FaAngleRight className="mx-1" />
          Chi tiết đơn hàng
        </h6>
      )}

      <div>
        {isLoading && <p>Đang tải chi tiết đơn hàng...</p>}

        {error ? (
          <p>Lỗi: {error?.data?.message || error.error}</p>
        ) : (
          isNotAuthorized && <p>Bạn không có quyền truy cập vào đơn hàng này</p>
        )}

        {isAuthorized && (
          <div>
            <p className="mt-3">
              <span className="text-black-50">Đặt hàng vào</span>{" "}
              {order.createdAt.substring(0, 10)}&nbsp;&nbsp;
              <span className="text-black-50">
                {" | "}&nbsp;&nbsp;Mã đơn hàng:
              </span>{" "}
              {orderId}
            </p>
            <Card className="p-3">
              <Row>
                <Col>
                  {isInAdmin && order.user && (
                    <>
                      <h6 className="order-lable">Thông tin người dùng</h6>
                      <p>
                        Tên:{" "}
                        <Link
                          to={`/admin/users/${order.user._id}`}
                          className="text-black"
                        >
                          {order.user.name}
                        </Link>
                        <br />
                        ID: {order.user._id}
                        <br />
                        Email: {order.user.email}
                      </p>
                    </>
                  )}
                  <h6 className="order-lable">Địa chỉ giao hàng</h6>
                  <p>
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}, <br />
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </p>
                </Col>
                <Col>
                  <h6 className="order-lable">Tóm tắt đơn hàng</h6>
                  <div>
                    <p>
                      Hàng hóa: ${order.itemsPrice}
                      <br />
                      Vận chuyển: ${order.shippingPrice} <br />
                      Thuế: ${order.taxPrice} <br />
                      Tổng cộng: ${order.totalPrice}
                    </p>
                  </div>
                </Col>
                <Col>
                  <h6 className="order-lable">Phương thức thanh toán</h6>
                  <p>{order.paymentMethod}</p>
                  <h6 className="order-lable">Trạng thái đơn hàng</h6>
                  {order.isPaid ? (
                    <div>
                      <FaCheck className="text-success me-2" />
                      {`Đã thanh toán vào ${order.paidAt.substring(0, 10)}`}
                    </div>
                  ) : (
                    <div>
                      <FaTimes className="text-primary me-2" />
                      Chưa thanh toán
                    </div>
                  )}
                  {order.isDelivered ? (
                    <div>
                      <FaCheck className="text-success me-2" />
                      {`Đã giao vào ${order.deliveredAt.substring(0, 10)}`}
                    </div>
                  ) : (
                    <div>
                      <FaTimes className="text-primary me-2" />
                      Chưa giao
                    </div>
                  )}

                  {isShowPayPalBtn && (
                    <PayPalPayment order={order} onPaid={onPaidHandler} />
                  )}
                </Col>
              </Row>
            </Card>

            <Card className="p-3 mt-4">
              <Table className="table table-striped table-hover table-style">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th></th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item) => (
                    <tr key={item.product}>
                      <td style={{ width: "50px" }}>
                        <Link to={`/product/${item.product}`}>
                          <ImageContainer
                            src={item.image}
                            alt={item.name}
                            className="img-thumbnail"
                            size="48px"
                          />
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/product/${item.product}`}
                          className="text-black"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>
                        {item.isOnSale ? (
                          <span>
                            <span className="text-decoration-line-through text-black-50">
                              ${item.price}
                            </span>
                            <span className="ms-2">${item.salePrice}</span>
                          </span>
                        ) : (
                          <span>${item.price}</span>
                        )}
                      </td>
                      <td>
                        {item.isOnSale ? (
                          <span>${(item.qty * item.salePrice).toFixed(2)}</span>
                        ) : (
                          <span>${(item.qty * item.price).toFixed(2)}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>

            {isInAdmin && (
              <Card className="p-3 mt-4">
                <h6 className="order-lable">Cập nhật trạng thái đơn hàng</h6>
                <p className="mt-2 mb-0">
                  <Button
                    onClick={payHandler}
                    disabled={loadingPay || order.isPaid}
                    className="rounded-pill px-3 me-4"
                    size="sm"
                  >
                    Đánh dấu là đã thanh toán
                  </Button>
                  <Button
                    onClick={deliverHandler}
                    disabled={loadingDeliver || order.isDelivered}
                    className="rounded-pill px-3"
                    size="sm"
                  >
                    Đánh dấu là đã giao
                  </Button>
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;

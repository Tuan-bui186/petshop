import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import OrderShipping from "../components/order/OrderShipping";
import OrderPayment from "../components/order/OrderPayment";
import OrderPrice from "../components/order/OrderPrice";
import PayPalPayment from "../components/order/PayPalPayment";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";
import { toast } from "react-toastify";

const ReviewOrderScreen = () => {
  const [order, setOrder] = useState({});

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { shippingAddress } = cart;

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (Object.keys(order).length > 0) {
        dispatch(clearCartItems());
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [order, dispatch]);

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const placeOrderHandler = async () => {
    const isNoItemsInCart = cartItems.length === 0;
    if (isNoItemsInCart) {
      toast.error("Giỏ hàng của bạn đang trống");
      return;
    }

    const isAddressValid =
      Object.keys(shippingAddress).length > 0 &&
      shippingAddress.isSaved &&
      Object.values(shippingAddress).every((val) => Boolean(val));
    if (!isAddressValid) {
      toast.error("Vui lòng lưu địa chỉ giao hàng");
      return;
    }

    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod || "PayPal",
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      toast.success("Đơn hàng đã được tạo thành công");
      setOrder(res);
    } catch (err) {
      console.error(err);
      toast.error("Tạo đơn hàng thất bại");
    }
  };
  const orderIsCreated = Object.keys(order).length > 0;

  const isDisabledOrderBtn =
    cartItems.length === 0 ||
    isLoading ||
    Object.keys(shippingAddress).length === 0 ||
    !shippingAddress.isSaved ||
    orderIsCreated;

  const getItemPrice = (item) => {
    return item.isOnSale ? (
      <>
        <span className="text-decoration-line-through text-black-50">
          ${item.price}
        </span>{" "}
        ${item.salePrice} x{item.qty} =
        {(item.qty * item.salePrice).toFixed(2)}
      </>
    ) : (
      <span>
        ${item.price} x {item.qty} = ${(item.qty * item.price).toFixed(2)}
      </span>
    );
  };

  const onPaidHandler = () => {
    dispatch(clearCartItems());
    navigate(`/ordersuccess/${order._id}`);
  };

  return (
    <>
      <PageTitle title="Xem Đơn Hàng" />

      <Row className="pt-2 pb-5">
        <Col md={7} lg={8}>
          <Card>
            <Card.Header>
              <h4 className="fs-5 fw-bold mb-0 text-black-50">Mặt hàng đơn hàng</h4>
            </Card.Header>
            <Card.Body>
              {cartItems.length > 0 && (
                <ListGroup variant="flush">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row>
                        <Col xs={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                            width={48}
                          />
                        </Col>
                        <Col xs={5}>
                          <Link
                            to={`/product/${item._id}`}
                            className="text-black"
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col xs={5} className="text-end">
                          {getItemPrice(item)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Header>
              <h4 className="fs-5 fw-bold mb-0 text-black-50">
                Địa chỉ giao hàng
              </h4>
            </Card.Header>
            <Card.Body>
              <OrderShipping />
            </Card.Body>
          </Card>

          <Card className="my-4">
            <Card.Header>
              <h4 className="fs-5 fw-bold mb-0 text-black-50">Thanh toán</h4>
            </Card.Header>
            <Card.Body>
              <OrderPayment />
            </Card.Body>
          </Card>
        </Col>

        <Col md={5} lg={4}>
          <Card className="py-2">
            <ListGroup variant="flush">
              <OrderPrice />

              <ListGroup.Item>
                <Button
                  className="btn-block rounded-pill px-4 mt-2 mb-2"
                  disabled={isDisabledOrderBtn}
                  onClick={placeOrderHandler}
                >
                  Đặt hàng với giá ${cart.totalPrice}
                </Button>
              </ListGroup.Item>

              {orderIsCreated && (
                <ListGroup.Item>
                  <div className="px-1 pt-3 pb-2">
                    <p className="fs-6 fw-bold mb-0">Đơn hàng đã được tạo</p>
                    <small>
                      Mã đơn hàng: {order?._id}
                      <br />
                      Sử dụng nút bên dưới để thanh toán bằng PayPal.
                    </small>
                  </div>
                  <PayPalPayment order={order} onPaid={onPaidHandler} />
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ReviewOrderScreen;

import { useParams, useNavigate } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import thankYouGif from "../assets/thank-you.gif";
import dogImg from "../assets/dog-smile-s.jpg";

const OrderSuccessScreen = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Row className="py-5">
        <Col xs={12} className="text-center pt-5 pb-4">
          <div className="order-success">
            <img src={dogImg} alt="Chó cười" className="dog-img" />
            <img src={thankYouGif} alt="Cảm ơn bạn" className="thank-you" />
          </div>
          <h2 className="mt-4 fw-bold fs-3">Đơn hàng của bạn đã được đặt!</h2>
          <p>Mã đơn hàng: {orderId} </p>
          <Row className="py-2">
            <Col>
              <Button
                onClick={() => navigate("/")}
                className="rounded-pill px-5"
              >
                Tiếp tục mua sắm
              </Button>
              <Button
                onClick={() => navigate("/account")}
                className="rounded-pill px-4 ms-3"
                variant="outline-primary"
              >
                Xem đơn hàng trong tài khoản
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default OrderSuccessScreen;

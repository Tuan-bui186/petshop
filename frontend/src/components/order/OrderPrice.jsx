import { Row, Col, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

const OrderPrice = ({ isInCart }) => {
  const cart = useSelector((state) => state.cart);

  const displayPrice = isInCart ? cart.preTaxPrice : cart.totalPrice;

  return (
    <>
      <ListGroup.Item>
        <Row>
          <Col>
            Tổng phụ <br></br>({cart.itemsNumberText})
          </Col>
          <Col className="text-end">${cart.itemsPrice}</Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Vận chuyển</Col>
          <Col className="text-end">
            {cart.shippingPrice > 0 ? `$${cart.shippingPrice}` : "Miễn phí"}
          </Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Thuế</Col>
          <Col className="text-end">
            {isInCart ? (
              <span className="text-black-50">Tính vào lúc thanh toán</span>
            ) : (
              `$${cart.taxPrice}`
            )}
          </Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row className="fs-5 fw-bold">
          <Col>{isInCart ? "Tổng ước tính" : "Tổng cộng"}</Col>
          <Col className="text-end">${displayPrice}</Col>
        </Row>
      </ListGroup.Item>
    </>
  );
};

export default OrderPrice;

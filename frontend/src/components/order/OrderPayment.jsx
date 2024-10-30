import { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { savePaymentMethod } from "../../slices/cartSlice";

const OrderPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const [isSaved, setIsSaved] = useState(true);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    setIsSaved(true);
  };

  return (
    <>
      {isSaved ? (
        <div>
          <p>
            <span className="fw-bold text-black-50">Phương thức đã lưu: </span>
            {paymentMethod}
          </p>
          <small className="text-black-50">
            * Sẽ thêm các phương thức thanh toán khác trong tương lai
          </small>

          {/* <div className="d-flex">
            <Button
              variant="outline-primary"
              size="sm"
              className="rounded-pill px-4 ms-auto"
              onClick={() => setIsSaved(false)}
            >
              Chỉnh sửa
            </Button>
          </div> */}
        </div>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Col>
              <Form.Check
                className="my-2"
                type="radio"
                label="PayPal"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>
          <div className="d-flex">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="rounded-pill px-4 ms-auto"
            >
              Lưu
            </Button>
          </div>
        </Form>
      )}
    </>
  );
};

export default OrderPayment;

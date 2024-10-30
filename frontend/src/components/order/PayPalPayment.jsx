import { Button, ListGroup } from "react-bootstrap";
import { useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
} from "../../slices/ordersApiSlice";
import { toast } from "react-toastify";

const PayPalPayment = ({ order, onPaid }) => {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (Object.keys(order).length > 0 && !order.isPaid) {
        loadPaypalScript();
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function createPayPalOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error("Thanh toán bằng PayPal thất bại");
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      const orderId = order._id;
      await paymentHandler({ orderId, details });
    });
  }

  const paymentHandler = async ({ orderId, details }) => {
    try {
      await payOrder({ orderId, details });
      toast.success("Đơn hàng đã được thanh toán");
      onPaid();
    } catch (error) {
      console.error(error);
      toast.error("Thanh toán không thành công");
      throw error;
    }
  };

  const markPaidHandler = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn đánh dấu đơn hàng này là đã thanh toán không?")) {
      return;
    }
    await paymentHandler({ orderId: order._id, details: { payer: {} } });
  };

  return (
    <ListGroup>
      <ListGroup.Item className="pt-3">
        {loadingPay && <p>Đang tải thông tin thanh toán</p>}
        {isPending ? (
          <p>Đang chờ xử lý</p>
        ) : (
          <PayPalButtons
            createOrder={createPayPalOrder}
            onApprove={onApprove}
            onError={onError}
          ></PayPalButtons>
        )}
        <small>
          <span style={{ wordBreak: "break-all" }}>
            Tài khoản thử nghiệm: sb-yj643q30574991@personal.example.com
          </span>
          <br />
          Mật khẩu: Rj^%1t+E
        </small>
      </ListGroup.Item>
      <ListGroup.Item>
        <div>
          <small>CHỈ DÀNH CHO THỬ NGHIỆM: Đánh dấu đơn hàng là đã thanh toán mà không cần PayPal.</small>
        </div>
        <Button
          variant="outline-secondary"
          className="btn-block rounded-pill px-4 my-2"
          onClick={markPaidHandler}
          size="sm"
        >
          Đánh dấu đơn hàng là đã thanh toán
        </Button>
      </ListGroup.Item>
    </ListGroup>
  );
};

export default PayPalPayment;

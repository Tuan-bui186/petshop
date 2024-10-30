import { useState, useEffect } from "react";
import Input from "../Input";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import Loader from "../Loader";
import { useSelector, useDispatch } from "react-redux";
import { useProfileMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";

const EditProfileModal = ({ show, onClose }) => {
  const [isAddAddress, setIsAddAddress] = useState(false);

  const userInfo = useSelector((state) => state.auth.userInfo);

  const { shippingAddress } = userInfo;

  const [userName, setUserName] = useState(userInfo.name || "");

  const [enteredAddress, setEnteredAddress] = useState({
    firstName: shippingAddress?.firstName || "",
    lastName: shippingAddress?.lastName || "",
    address: shippingAddress?.address || "",
    city: shippingAddress?.city || "",
    postalCode: shippingAddress?.postalCode || "",
    country: shippingAddress?.country || "",
  });

  useEffect(() => {
    if (shippingAddress) {
      setIsAddAddress(true);
    }
  }, []);

  function handleInputChange(identifier, value) {
    setEnteredAddress((prevValues) => ({
      ...prevValues,
      [identifier]: value,
    }));
  }

  const [updateProfile, { isLoading }] = useProfileMutation();

  const dispatch = useDispatch();

  const resetPasswordHandler = async (e) => {
    e.preventDefault();

    if (!userName) {
      toast.error("Tên người dùng là bắt buộc");
      return;
    }

    if (isAddAddress) {
      const isValidate = Object.values(enteredAddress).every(
        (val) => val.trim().length > 0
      );
      if (!isValidate) {
        toast.error("Tất cả các trường đều bắt buộc");
        return;
      }
    }

    try {
      const res = await updateProfile({
        name: userName,
        shippingAddress: isAddAddress ? enteredAddress : null,
      }).unwrap();
      toast.success("Cập nhật hồ sơ thành công");
      dispatch(setCredentials({ ...res }));
      if (!isAddAddress) {
        resetAddress();
      }
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  function resetAddress() {
    setEnteredAddress({
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    });
  }

  const formInvalid = !userName || isLoading;

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa hồ sơ</Modal.Title>
      </Modal.Header>
      <Form onSubmit={resetPasswordHandler}>
        <Modal.Body>
          <h5 className="fw-bold mt-3 mb-3">Thông tin cơ bản</h5>
          <p>
            <span className="fw-bold text-black-50">ID người dùng: </span>
            {userInfo?._id}
          </p>
          <p>
            <span className="fw-bold text-black-50">Email: </span>
            {userInfo?.email}
          </p>

          <Row>
            <Input
              type="text"
              controlId="userName"
              label="Tên người dùng"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </Row>

          <Form.Check
            type="radio"
            label="Thêm địa chỉ giao hàng mặc định (tùy chọn)"
            id="shippingAddress"
            checked={isAddAddress}
            onClick={() => setIsAddAddress((prev) => !prev)}
            className="fs-5 fw-bold mt-4 mb-3"
          />

          {isAddAddress && (
            <>
              <Row>
                <Col>
                  <Input
                    type="text"
                    controlId="firstName"
                    label="Họ"
                    value={enteredAddress.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </Col>
                <Col>
                  <Input
                    type="text"
                    controlId="lastName"
                    label="Tên"
                    value={enteredAddress.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <Input
                    type="text"
                    controlId="address"
                    label="Địa chỉ"
                    value={enteredAddress.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                </Col>
                <Col>
                  <Input
                    type="text"
                    controlId="city"
                    label="Thành phố"
                    value={enteredAddress.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Input
                    type="text"
                    controlId="postalCode"
                    label="Mã bưu điện"
                    value={enteredAddress.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                  />
                </Col>
                <Col>
                  <Input
                    type="text"
                    controlId="country"
                    label="Quốc gia"
                    value={enteredAddress.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                  />
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            className="rounded-pill px-4"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="rounded-pill px-4"
            disabled={formInvalid}
          >
            {isLoading && <Loader />}
            Lưu
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;

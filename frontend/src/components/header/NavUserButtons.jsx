import { Button, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import { useLogoutMutation } from "../../slices/usersApiSlice";

const NavUserButtons = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {userInfo ? (
        <NavDropdown
          title={userInfo.name}
          id="username"
          align="end"
          className="header-dropdown"
        >
          {userInfo.isAdmin && (
            <>
              <NavDropdown.Item href="/admin/orders">
              Bảng điều khiển quản trị
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </>
          )}
          <NavDropdown.Item href="/account">Tài Khoản</NavDropdown.Item>
          <NavDropdown.Item onClick={logoutHandler}>
            <span className="text-primary">Đăng xuất</span>
          </NavDropdown.Item>
        </NavDropdown>
      ) : (
        <Nav.Link href="/login">
          <Button className="rounded-pill px-3 btn-primary" size="sm">
            <span>Đăng nhập</span>
          </Button>
        </Nav.Link>
      )}
    </>
  );
};

export default NavUserButtons;

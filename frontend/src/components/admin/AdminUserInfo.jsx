import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useDeleteUserMutation } from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

const AdminUserInfo = ({ user }) => {
  const navigator = useNavigate();

  const shippingAddress = user?.shippingAddress;

  const [deleteUser] = useDeleteUserMutation();

  const handleDeleteUser = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        await deleteUser(user._id);
        toast.success("Người dùng đã được xóa thành công");
        navigator("/admin/users");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Card className="user-info p-4">
      <div className="user-avatar">
        <FaUserCircle size={96} className="user-icon" />
        {user.isAdmin && <div className="admin-label">Quản Trị Viên</div>}
      </div>

      <label>Tên Người Dùng</label>
      <p>{user?.name}</p>
      <label>Email</label>
      <p> {user?.email}</p>
      <label>ID Người Dùng</label>
      <p>{user?._id}</p>

      {shippingAddress && (
        <>
          <label>Địa Chỉ Giao Hàng</label>
          <p>
            {shippingAddress.firstName} {shippingAddress.lastName}
            <br />
            {shippingAddress.address}
            {", "}
            {shippingAddress.city}
            {", "}
            {shippingAddress.postalCode}
            {", "}
            {shippingAddress.country}
          </p>
        </>
      )}

      {!user?.isAdmin && (
        <Button
          variant="outline-danger"
          className="rounded-pill mt-2"
          size="sm"
          onClick={handleDeleteUser}
        >
          Xóa Người Dùng
        </Button>
      )}
    </Card>
  );
};

export default AdminUserInfo;

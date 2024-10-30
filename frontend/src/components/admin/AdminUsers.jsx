import { FaCheck, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const { data: users, refetch, error, isLoading } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const handleDeleteUser = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        await deleteUser(id);
        toast.success("Người dùng đã được xóa thành công");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="mt-3">
      {isLoading && <p>Đang tải...</p>}
      {error && <p>{error}</p>}
      {users && (
        <Table striped hover responsive className="table-style">
          <thead>
            <tr>
              <th>ID Người Dùng</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Quản Trị Viên</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin && <FaCheck />}</td>
                <td className="text-nowrap">
                  <Link to={`/admin/users/${user._id}`}>
                    <Button size="sm" variant="light" className="me-2">
                      <FaRegEdit />
                    </Button>
                  </Link>
                  {!user.isAdmin && (
                    <Button
                      size="sm"
                      variant="light"
                      className="text-primary"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <RiDeleteBin6Line />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminUsers;

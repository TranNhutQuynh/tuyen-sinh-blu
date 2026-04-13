import { Link, Outlet, useNavigate } from "react-router-dom";
import ThemeToggle from "../theme/ThemeToggle";

export default function AdminLayout() {
  const navigate = useNavigate();

  const ADMIN_TOKEN_KEY = "admin_token";
  const ADMIN_USER_KEY = "admin_user";

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
    window.alert("Đã đăng xuất!");
    navigate("/admin/login");
  };

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-soft shadow-sm border-bottom border-opacity-10">
        <div className="container py-2 flex-wrap gap-3">
          <Link className="navbar-brand fw-bold" to="/admin/dashboard">
            Admin tuyển sinh
          </Link>
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <Link className="btn btn-sm btn-nav-soft" to="/admin/dashboard">
              Tổng quan
            </Link>
            <Link className="btn btn-sm btn-nav-soft" to="/admin/candidates">
              Danh sách hồ sơ
            </Link>
            <ThemeToggle />
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>
      <main className="container py-4 py-lg-5">
        <Outlet />
      </main>
    </div>
  );
}

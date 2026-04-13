import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/adminApi";
import ThemeToggle from "../../components/theme/ThemeToggle";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const ADMIN_TOKEN_KEY = "admin_token";
  const ADMIN_USER_KEY = "admin_user";

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      const result = await loginAdmin(form);
      const token = result?.data?.token || result?.token;
      const admin = result?.data?.admin || result?.admin;

      if (!token) {
        window.alert("Không nhận được token đăng nhập!");
        return;
      }

      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);

      if (admin) {
        sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
      }

      window.alert("Đăng nhập thành công");
      navigate("/admin/dashboard");
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu!"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell py-5">
      <div className="container">
        <div className="d-flex justify-content-end mb-3">
          <ThemeToggle />
        </div>

        <div className="row justify-content-center align-items-center g-4">
          <div className="col-lg-5">
            <div className="card section-card auth-card">
              <div className="card-body p-4 p-lg-5">
                <span className="hero-chip mb-3 d-inline-flex">
                  Trang quản trị tuyển sinh
                </span>

                <h1 className="h3 mb-2">Đăng nhập admin</h1>

                <p className="small-muted mb-4">
                  Chỉ admin mới có quyền rà soát hồ sơ, chỉnh sửa dữ liệu và
                  xuất Excel theo mẫu.
                </p>

                <form onSubmit={handleSubmit} className="d-grid gap-3">
                  <div>
                    <label className="form-label">Tên đăng nhập</label>
                    <input
                      className="form-control"
                      value={form.username}
                      onChange={(event) =>
                        handleChange("username", event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="form-label">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      value={form.password}
                      onChange={(event) =>
                        handleChange("password", event.target.value)
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-action"
                    disabled={submitting}
                  >
                    {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

function DashboardCard({ title, description, buttonText, to }) {
  return (
    <div className="card section-card h-100">
      <div className="card-body d-flex flex-column">
        <h2 className="h4 mb-3">{title}</h2>
        <p className="small-muted mb-4">{description}</p>

        <div className="mt-auto">
          <Link className="btn btn-primary btn-action w-100" to={to}>
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="d-flex flex-column gap-4">
      <div className="card section-card">
        <div className="card-body">
          <span className="hero-chip mb-3 d-inline-flex">Admin tuyển sinh</span>
          <h1 className="h3 mb-2">Bảng điều khiển quản trị</h1>
          <p className="small-muted mb-0">
            Quản lý hồ sơ, danh mục tuyển sinh, đợt đăng ký và xuất dữ liệu
            Excel theo biểu mẫu.
          </p>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <DashboardCard
          title="Danh sách hồ sơ"
          description="Xem, rà soát, chỉnh sửa, xóa hồ sơ thí sinh và export dữ liệu."
          buttonText="Vào quản lý hồ sơ"
          to="/admin/candidates"
        />

        <DashboardCard
          title="Quản lý danh mục tuyển sinh"
          description="Quản lý trường THPT, ngành tuyển sinh, tổ hợp môn và phương thức xét tuyển."
          buttonText="Quản lý danh mục"
          to="/admin/catalogs"
        />

        <DashboardCard
          title="Quản lý đợt đăng ký"
          description="Thiết lập đợt 1, đợt 2, thời gian mở và đóng nhận hồ sơ."
          buttonText="Thiết lập đợt"
          to="/admin/registration-periods"
        />
      </div>
    </div>
  );
}

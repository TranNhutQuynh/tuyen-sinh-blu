import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  return (
    <div className="d-flex flex-column gap-4">
      <div className="card section-card">
        <div className="card-body">
          <h1 className="h4 mb-2">Trang quản trị tuyển sinh</h1>
          <p className="mb-0">
            Từ đây admin có thể quản lý hồ sơ, danh mục trường/ngành/tổ
            hợp/phương thức và thiết lập đợt đăng ký.
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card section-card h-100">
            <div className="card-body d-flex flex-column">
              <h2 className="h5">Hồ sơ thí sinh</h2>
              <p className="small-muted flex-grow-1">
                Xem danh sách, chỉnh sửa và export dữ liệu đầu vào ra Excel.
              </p>
              <Link className="btn btn-primary" to="/admin/candidates">
                Đi tới hồ sơ
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card section-card h-100">
            <div className="card-body d-flex flex-column">
              <h2 className="h5">Danh mục tuyển sinh</h2>
              <p className="small-muted flex-grow-1">
                Quản lý trường THPT, ngành, tổ hợp môn và phương thức xét tuyển.
              </p>
              <Link className="btn btn-primary" to="/admin/catalogs">
                Quản lý danh mục
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card section-card h-100">
            <div className="card-body d-flex flex-column">
              <h2 className="h5">Đợt đăng ký</h2>
              <p className="small-muted flex-grow-1">
                Thiết lập đợt 1, đợt 2, thời gian mở và đóng nhận hồ sơ.
              </p>
              <Link
                className="btn btn-primary"
                to="/admin/registration-periods"
              >
                Thiết lập đợt
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

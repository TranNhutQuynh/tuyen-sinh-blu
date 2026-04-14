import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  buildExportUrl,
  deleteCandidate,
  getCandidates,
} from "../../api/adminApi";

const exportTypes = [
  { key: "nguyen-vong", label: "Export nguyện vọng" },
  { key: "diem-thpt", label: "Export điểm THPT" },
  { key: "hoc-ba", label: "Export học bạ" },
  { key: "gdnl", label: "Export ĐGNL" },
  { key: "vsat", label: "Export V-SAT" },
];

export default function AdminCandidateListPage() {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getCandidates();
      setItems(result.data || []);
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Không tải được danh sách hồ sơ"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return items;
    }

    return items.filter((item) =>
      [item.applicationCode, item.fullName, item.nationalId, item.examNumber]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(normalizedKeyword)
        )
    );
  }, [items, keyword]);

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa hồ sơ "${item.fullName}" (${item.applicationCode}) không?`
    );

    if (!confirmed) return;

    try {
      await deleteCandidate(item.id);
      window.alert("Xóa hồ sơ thành công");
      await loadData();
    } catch (error) {
      window.alert(error.response?.data?.message || "Không xóa được hồ sơ");
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="card section-card">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
            <div>
              <h1 className="h4 mb-1">Danh sách hồ sơ thí sinh</h1>
              <div className="small-muted">
                Admin xem, rà soát, chỉnh sửa, xóa và export dữ liệu.
              </div>
            </div>

            <div className="admin-toolbar">
              <Link className="btn btn-outline-secondary" to="/admin/dashboard">
                ← Quay lại
              </Link>

              <button className="btn btn-outline-secondary" onClick={loadData}>
                Làm mới
              </button>
            </div>
          </div>

          <div className="row g-3 align-items-end">
            <div className="col-12 col-lg-6">
              <label className="form-label">
                Tìm theo mã hồ sơ / họ tên / CCCD / SBD
              </label>
              <input
                className="form-control"
                placeholder="Nhập từ khóa..."
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>

            <div className="col-12 col-lg-6">
              <div className="admin-toolbar justify-content-lg-end">
                {exportTypes.map((item) => (
                  <a
                    key={item.key}
                    className="btn btn-primary"
                    href={buildExportUrl(item.key)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card section-card">
        <div className="card-body">
          {loading ? (
            <div>Đang tải dữ liệu...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle table-themed">
                <thead className="table-head-soft">
                  <tr>
                    <th>Mã hồ sơ</th>
                    <th>Họ tên</th>
                    <th>CCCD</th>
                    <th>SBD</th>
                    <th>Năm TN</th>
                    <th>Số NV</th>
                    <th>Cập nhật</th>
                    <th style={{ minWidth: 260 }}>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.applicationCode}</td>
                      <td>{item.fullName}</td>
                      <td>{item.nationalId}</td>
                      <td>{item.examNumber}</td>
                      <td>{item.graduationYear}</td>
                      <td>{item.preferenceCount}</td>
                      <td>
                        {item.updatedAt
                          ? new Date(item.updatedAt).toLocaleString("vi-VN")
                          : ""}
                      </td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <Link
                            className="btn btn-sm btn-outline-secondary"
                            to={`/admin/candidates/${item.id}`}
                          >
                            Xem
                          </Link>

                          <Link
                            className="btn btn-sm btn-outline-primary"
                            to={`/admin/candidates/${item.id}/edit`}
                          >
                            Sửa
                          </Link>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!filteredItems.length ? (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-4">
                        Chưa có hồ sơ nào.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createRegistrationPeriod,
  deleteRegistrationPeriod,
  getAdminCatalogSummary,
  updateRegistrationPeriod,
} from "../../api/adminApi";

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value.slice(0, 16) : "";
  }

  const pad = (num) => String(num).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function normalizePeriod(item) {
  return {
    ...item,
    start_at: toDateTimeLocal(item.start_at),
    end_at: toDateTimeLocal(item.end_at),
    _isEditing: false,
    _isNew: false,
  };
}

function createEmptyPeriod() {
  return {
    id: "",
    period_name: "",
    start_at: "",
    end_at: "",
    is_active: 1,
    _isEditing: true,
    _isNew: true,
  };
}

export default function AdminRegistrationPeriodPage() {
  const [loading, setLoading] = useState(true);
  const [periods, setPeriods] = useState([]);
  const [originalPeriods, setOriginalPeriods] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getAdminCatalogSummary();

      const normalizedPeriods = (result.periods || []).map(normalizePeriod);

      setPeriods(normalizedPeriods);
      setOriginalPeriods(normalizedPeriods);
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Không tải được dữ liệu đợt đăng ký"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateArrayItem = (index, field, value) => {
    setPeriods((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAdd = () => {
    setPeriods((prev) => [...prev, createEmptyPeriod()]);
  };

  const handleEdit = (index) => {
    setPeriods((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, _isEditing: true } : item
      )
    );
  };

  const handleCancel = (item, index) => {
    if (item._isNew) {
      setPeriods((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
      return;
    }

    const originalItem = originalPeriods.find(
      (period) => String(period.id) === String(item.id)
    );

    if (!originalItem) {
      loadData();
      return;
    }

    setPeriods((prev) =>
      prev.map((period, itemIndex) =>
        itemIndex === index ? { ...originalItem, _isEditing: false } : period
      )
    );
  };

  const handleSave = async (item) => {
    try {
      if (!item.period_name?.trim() || !item.start_at || !item.end_at) {
        return window.alert(
          "Vui lòng nhập tên đợt, thời gian mở và đóng đăng ký"
        );
      }

      const payload = {
        periodName: item.period_name.trim(),
        startAt: item.start_at,
        endAt: item.end_at,
        isActive: item.is_active ? 1 : 0,
      };

      if (item.id) {
        await updateRegistrationPeriod(item.id, payload);
        window.alert("Cập nhật đợt đăng ký thành công");
      } else {
        await createRegistrationPeriod(payload);
        window.alert("Thêm đợt đăng ký thành công");
      }

      await loadData();
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Không lưu được đợt đăng ký"
      );
    }
  };

  const handleDelete = async (item) => {
    if (!item.id) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa "${item.period_name}" không?`
    );

    if (!confirmed) return;

    try {
      await deleteRegistrationPeriod(item.id);
      window.alert("Xóa đợt đăng ký thành công");
      await loadData();
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Không xóa được đợt đăng ký"
      );
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu đợt đăng ký...</div>;
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div className="card section-card">
        <div className="card-body d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h1 className="h4 mb-2">Quản lý đợt đăng ký</h1>
            <div className="small-muted">
              Thiết lập đợt 1, đợt 2, thời gian mở và đóng nhận hồ sơ.
            </div>
          </div>

          <div className="admin-toolbar">
            <Link className="btn btn-outline-secondary" to="/admin/dashboard">
              ← Quay lại
            </Link>
          </div>
        </div>
      </div>

      <div className="card section-card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="h5 mb-0">Danh sách đợt đăng ký</h2>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleAdd}
            >
              + Thêm mới
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered align-middle table-themed table-compact">
              <thead className="table-head-soft">
                <tr>
                  <th>Tên đợt</th>
                  <th>Mở đăng ký</th>
                  <th>Đóng đăng ký</th>
                  <th>Kích hoạt</th>
                  <th style={{ width: 220 }}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {periods.map((item, index) => (
                  <tr key={item.id || `new-period-${index}`}>
                    <td>
                      <input
                        className="form-control"
                        value={item.period_name ?? ""}
                        disabled={!item._isEditing}
                        onChange={(event) =>
                          updateArrayItem(
                            index,
                            "period_name",
                            event.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={item.start_at ?? ""}
                        disabled={!item._isEditing}
                        onChange={(event) =>
                          updateArrayItem(index, "start_at", event.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={item.end_at ?? ""}
                        disabled={!item._isEditing}
                        onChange={(event) =>
                          updateArrayItem(index, "end_at", event.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={Boolean(item.is_active)}
                        disabled={!item._isEditing}
                        onChange={(event) =>
                          updateArrayItem(
                            index,
                            "is_active",
                            event.target.checked ? 1 : 0
                          )
                        }
                      />
                    </td>

                    <td className="text-nowrap">
                      {item._isEditing ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleSave(item)}
                          >
                            Lưu
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleCancel(item, index)}
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(index)}
                          >
                            Sửa
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item)}
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}

                {!periods.length ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      Chưa có đợt đăng ký nào.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

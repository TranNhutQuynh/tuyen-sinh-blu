import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createAdmissionMethod,
  createHighSchool,
  createMajor,
  createSubjectCombination,
  deleteAdmissionMethod,
  deleteHighSchool,
  deleteMajor,
  deleteSubjectCombination,
  getAdminCatalogSummary,
  updateAdmissionMethod,
  updateHighSchool,
  updateMajor,
  updateSubjectCombination,
} from "../../api/adminApi";

function CatalogSection({
  title,
  items,
  columns,
  onFieldChange,
  onSave,
  onDelete,
  onAdd,
}) {
  return (
    <div className="card section-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h2 className="h5 mb-0">{title}</h2>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={onAdd}
          >
            + Thêm mới
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered align-middle table-themed table-compact">
            <thead className="table-head-soft">
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                <th style={{ width: 160 }}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || `new-${title}-${index}`}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.type === "checkbox" ? (
                        <input
                          type="checkbox"
                          checked={Boolean(item[column.key])}
                          onChange={(event) =>
                            onFieldChange(
                              index,
                              column.key,
                              event.target.checked ? 1 : 0
                            )
                          }
                        />
                      ) : (
                        <input
                          type={column.type || "text"}
                          className="form-control"
                          value={item[column.key] ?? ""}
                          onChange={(event) =>
                            onFieldChange(index, column.key, event.target.value)
                          }
                        />
                      )}
                    </td>
                  ))}

                  <td className="text-nowrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => onSave(item)}
                    >
                      Lưu
                    </button>

                    {item.id ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(item)}
                      >
                        Xóa
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}

              {!items.length ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="text-center text-muted py-4"
                  >
                    Chưa có dữ liệu
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function createEmptySchool() {
  return {
    id: "",
    school_code: "",
    school_name: "",
    is_active: 1,
  };
}

function createEmptyMajor() {
  return {
    id: "",
    major_code: "",
    major_name: "",
    is_active: 1,
  };
}

function createEmptyCombination() {
  return {
    id: "",
    combination_code: "",
    combination_name: "",
    is_active: 1,
  };
}

function createEmptyMethod() {
  return {
    id: "",
    method_code: "",
    method_name: "",
    is_active: 1,
  };
}

export default function AdminCatalogPage() {
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [majors, setMajors] = useState([]);
  const [subjectCombinations, setSubjectCombinations] = useState([]);
  const [methods, setMethods] = useState([]);

  const schoolColumns = [
    { key: "school_code", label: "Mã trường" },
    { key: "school_name", label: "Tên trường" },
    { key: "is_active", label: "Kích hoạt", type: "checkbox" },
  ];

  const majorColumns = [
    { key: "major_code", label: "Mã ngành" },
    { key: "major_name", label: "Tên ngành" },
    { key: "is_active", label: "Kích hoạt", type: "checkbox" },
  ];

  const subjectCombinationColumns = [
    { key: "combination_code", label: "Mã tổ hợp" },
    { key: "combination_name", label: "Tên tổ hợp" },
    { key: "is_active", label: "Kích hoạt", type: "checkbox" },
  ];

  const methodColumns = [
    { key: "method_code", label: "Mã phương thức" },
    { key: "method_name", label: "Tên phương thức" },
    { key: "is_active", label: "Kích hoạt", type: "checkbox" },
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getAdminCatalogSummary();

      setSchools(result.schools || []);
      setMajors(result.majors || []);
      setSubjectCombinations(result.subjectCombinations || []);
      setMethods(result.methods || []);
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Không tải được dữ liệu danh mục"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateArrayItem = (setter) => (index, field, value) => {
    setter((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const saveSchool = async (item) => {
    try {
      if (!item.school_code?.trim() || !item.school_name?.trim()) {
        return window.alert("Vui lòng nhập mã trường và tên trường");
      }

      const payload = {
        schoolCode: item.school_code.trim(),
        schoolName: item.school_name.trim(),
        isActive: item.is_active ? 1 : 0,
      };

      if (item.id) {
        await updateHighSchool(item.id, payload);
      } else {
        await createHighSchool(payload);
      }

      await loadData();
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Không lưu được trường THPT"
      );
    }
  };

  const saveMajor = async (item) => {
    try {
      if (!item.major_code?.trim() || !item.major_name?.trim()) {
        return window.alert("Vui lòng nhập mã ngành và tên ngành");
      }

      const payload = {
        majorCode: item.major_code.trim(),
        majorName: item.major_name.trim(),
        isActive: item.is_active ? 1 : 0,
      };

      if (item.id) {
        await updateMajor(item.id, payload);
      } else {
        await createMajor(payload);
      }

      await loadData();
    } catch (error) {
      window.alert(error.response?.data?.message || "Không lưu được ngành");
    }
  };

  const saveCombination = async (item) => {
    try {
      if (!item.combination_code?.trim() || !item.combination_name?.trim()) {
        return window.alert("Vui lòng nhập mã tổ hợp và tên tổ hợp");
      }

      const payload = {
        combinationCode: item.combination_code.trim(),
        combinationName: item.combination_name.trim(),
        isActive: item.is_active ? 1 : 0,
      };

      if (item.id) {
        await updateSubjectCombination(item.id, payload);
      } else {
        await createSubjectCombination(payload);
      }

      await loadData();
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Không lưu được tổ hợp môn"
      );
    }
  };

  const saveMethod = async (item) => {
    try {
      if (!item.method_code?.trim() || !item.method_name?.trim()) {
        return window.alert("Vui lòng nhập mã phương thức và tên phương thức");
      }

      const payload = {
        methodCode: item.method_code.trim(),
        methodName: item.method_name.trim(),
        isActive: item.is_active ? 1 : 0,
      };

      if (item.id) {
        await updateAdmissionMethod(item.id, payload);
      } else {
        await createAdmissionMethod(payload);
      }

      await loadData();
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Không lưu được phương thức xét tuyển"
      );
    }
  };

  const removeSchool = async (item) => {
    try {
      await deleteHighSchool(item.id);
      await loadData();
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Không xóa được trường THPT"
      );
    }
  };

  const removeMajor = async (item) => {
    try {
      await deleteMajor(item.id);
      await loadData();
    } catch (error) {
      window.alert(error.response?.data?.message || "Không xóa được ngành");
    }
  };

  const removeCombination = async (item) => {
    try {
      await deleteSubjectCombination(item.id);
      await loadData();
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Không xóa được tổ hợp môn"
      );
    }
  };

  const removeMethod = async (item) => {
    try {
      await deleteAdmissionMethod(item.id);
      await loadData();
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Không xóa được phương thức xét tuyển"
      );
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu quản trị...</div>;
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div className="card section-card">
        <div className="card-body d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h1 className="h4 mb-2">Quản lý danh mục tuyển sinh</h1>
            <div className="small-muted">
              Quản lý trường THPT, ngành, tổ hợp môn và phương thức xét tuyển.
            </div>
          </div>

          <div className="admin-toolbar">
            <Link className="btn btn-outline-secondary" to="/admin/dashboard">
              ← Quay lại
            </Link>
          </div>
        </div>
      </div>

      <CatalogSection
        title="Trường THPT"
        items={schools}
        columns={schoolColumns}
        onFieldChange={updateArrayItem(setSchools)}
        onSave={saveSchool}
        onDelete={removeSchool}
        onAdd={() => setSchools((prev) => [...prev, createEmptySchool()])}
      />

      <CatalogSection
        title="Ngành tuyển sinh"
        items={majors}
        columns={majorColumns}
        onFieldChange={updateArrayItem(setMajors)}
        onSave={saveMajor}
        onDelete={removeMajor}
        onAdd={() => setMajors((prev) => [...prev, createEmptyMajor()])}
      />

      <CatalogSection
        title="Tổ hợp môn"
        items={subjectCombinations}
        columns={subjectCombinationColumns}
        onFieldChange={updateArrayItem(setSubjectCombinations)}
        onSave={saveCombination}
        onDelete={removeCombination}
        onAdd={() =>
          setSubjectCombinations((prev) => [...prev, createEmptyCombination()])
        }
      />

      <CatalogSection
        title="Phương thức xét tuyển"
        items={methods}
        columns={methodColumns}
        onFieldChange={updateArrayItem(setMethods)}
        onSave={saveMethod}
        onDelete={removeMethod}
        onAdd={() => setMethods((prev) => [...prev, createEmptyMethod()])}
      />
    </div>
  );
}

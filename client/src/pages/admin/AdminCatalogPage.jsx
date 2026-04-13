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

const TABS = [
  { key: "schools",      label: "Trường THPT",            icon: "🏫" },
  { key: "majors",       label: "Ngành tuyển sinh",        icon: "🎓" },
  { key: "combinations", label: "Tổ hợp môn",             icon: "📚" },
  { key: "methods",      label: "Phương thức xét tuyển",  icon: "📋" },
];

function CatalogTab({
  columns,
  items,
  onFieldChange,
  onSave,
  onDelete,
  onAdd,
}) {
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) => {
    if (!search.trim()) return true;
    return columns.some((col) =>
      String(item[col.key] ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  return (
    <div className="ctab-body">
      {/* Toolbar */}
      <div className="ctab-toolbar">
        <div className="ctab-search-wrap">
          <span className="ctab-search-icon">🔍</span>
          <input
            type="text"
            className="ctab-search"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="ctab-search-clear" onClick={() => setSearch("")}>
              ×
            </button>
          )}
        </div>
        <button className="btn btn-primary btn-sm ctab-add-btn" onClick={onAdd}>
          + Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive ctab-table-wrap">
        <table className="table table-bordered align-middle table-themed table-compact">
          <thead className="table-head-soft">
            <tr>
              <th className="ctab-col-num">#</th>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th style={{ width: 140 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => {
              const realIndex = items.indexOf(item);
              return (
                <tr
                  key={item.id || `new-${idx}`}
                  className={!item.id ? "ctab-row-new" : ""}
                >
                  <td className="ctab-col-num text-center">
                    {item.id ? (
                      <span className="ctab-row-index">{idx + 1}</span>
                    ) : (
                      <span className="catalog-badge-new">Mới</span>
                    )}
                  </td>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.type === "checkbox" ? (
                        <div className="catalog-toggle-wrap">
                          <input
                            type="checkbox"
                            className="catalog-toggle"
                            id={`tog-${realIndex}-${col.key}`}
                            checked={Boolean(item[col.key])}
                            onChange={(e) =>
                              onFieldChange(realIndex, col.key, e.target.checked ? 1 : 0)
                            }
                          />
                          <label
                            htmlFor={`tog-${realIndex}-${col.key}`}
                            className="catalog-toggle-label"
                          />
                        </div>
                      ) : (
                        <input
                          type={col.type || "text"}
                          className="form-control form-control-sm"
                          value={item[col.key] ?? ""}
                          onChange={(e) =>
                            onFieldChange(realIndex, col.key, e.target.value)
                          }
                        />
                      )}
                    </td>
                  ))}
                  <td className="text-nowrap">
                    <button
                      className="btn btn-sm btn-primary me-1"
                      onClick={() => onSave(item)}
                    >
                      Lưu
                    </button>
                    {item.id && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(item)}
                      >
                        Xóa
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {!filtered.length && (
              <tr>
                <td colSpan={columns.length + 2} className="text-center py-5">
                  <div className="catalog-empty">
                    <div className="catalog-empty-text">
                      {search ? `Không tìm thấy kết quả cho "${search}"` : "Chưa có dữ liệu"}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="ctab-footer">
        <span className="small-muted">
          {search
            ? `${filtered.length} / ${items.length} bản ghi`
            : `${items.length} bản ghi`}
        </span>
        {items.filter((i) => !i.id).length > 0 && (
          <span className="ctab-unsaved-hint">
            ⚠ Có {items.filter((i) => !i.id).length} dòng chưa lưu
          </span>
        )}
      </div>
    </div>
  );
}

/* ── helpers ── */
const createEmptySchool      = () => ({ id: "", school_code: "",      school_name: "",      is_active: 1 });
const createEmptyMajor       = () => ({ id: "", major_code: "",       major_name: "",       is_active: 1 });
const createEmptyCombination = () => ({ id: "", combination_code: "", combination_name: "", is_active: 1 });
const createEmptyMethod      = () => ({ id: "", method_code: "",      method_name: "",      is_active: 1 });

export default function AdminCatalogPage() {
  const [loading, setLoading]               = useState(true);
  const [activeTab, setActiveTab]           = useState("schools");
  const [schools, setSchools]               = useState([]);
  const [majors, setMajors]                 = useState([]);
  const [subjectCombinations, setSubjectCombinations] = useState([]);
  const [methods, setMethods]               = useState([]);

  const counts = {
    schools:      schools.length,
    majors:       majors.length,
    combinations: subjectCombinations.length,
    methods:      methods.length,
  };

  /* columns */
  const schoolColumns = [
    { key: "school_code", label: "Mã trường" },
    { key: "school_name", label: "Tên trường" },
    { key: "is_active",   label: "Kích hoạt", type: "checkbox" },
  ];
  const majorColumns = [
    { key: "major_code", label: "Mã ngành" },
    { key: "major_name", label: "Tên ngành" },
    { key: "is_active",  label: "Kích hoạt", type: "checkbox" },
  ];
  const combinationColumns = [
    { key: "combination_code", label: "Mã tổ hợp" },
    { key: "combination_name", label: "Tên tổ hợp" },
    { key: "is_active",        label: "Kích hoạt", type: "checkbox" },
  ];
  const methodColumns = [
    { key: "method_code", label: "Mã phương thức" },
    { key: "method_name", label: "Tên phương thức" },
    { key: "is_active",   label: "Kích hoạt", type: "checkbox" },
  ];

  /* load */
  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getAdminCatalogSummary();
      setSchools(result.schools || []);
      setMajors(result.majors || []);
      setSubjectCombinations(result.subjectCombinations || []);
      setMethods(result.methods || []);
    } catch (err) {
      window.alert(err.response?.data?.message || "Không tải được dữ liệu danh mục");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadData(); }, []);

  const updateItem = (setter) => (index, field, value) =>
    setter((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));

  /* save / delete helpers (unchanged logic) */
  const saveSchool = async (item) => {
    try {
      if (!item.school_code?.trim() || !item.school_name?.trim())
        return window.alert("Vui lòng nhập mã trường và tên trường");
      const p = { schoolCode: item.school_code.trim(), schoolName: item.school_name.trim(), isActive: item.is_active ? 1 : 0 };
      item.id ? await updateHighSchool(item.id, p) : await createHighSchool(p);
      await loadData();
    } catch (err) { window.alert(err.response?.data?.message || "Không lưu được trường THPT"); }
  };
  const saveMajor = async (item) => {
    try {
      if (!item.major_code?.trim() || !item.major_name?.trim())
        return window.alert("Vui lòng nhập mã ngành và tên ngành");
      const p = { majorCode: item.major_code.trim(), majorName: item.major_name.trim(), isActive: item.is_active ? 1 : 0 };
      item.id ? await updateMajor(item.id, p) : await createMajor(p);
      await loadData();
    } catch (err) { window.alert(err.response?.data?.message || "Không lưu được ngành"); }
  };
  const saveCombination = async (item) => {
    try {
      if (!item.combination_code?.trim() || !item.combination_name?.trim())
        return window.alert("Vui lòng nhập mã tổ hợp và tên tổ hợp");
      const p = { combinationCode: item.combination_code.trim(), combinationName: item.combination_name.trim(), isActive: item.is_active ? 1 : 0 };
      item.id ? await updateSubjectCombination(item.id, p) : await createSubjectCombination(p);
      await loadData();
    } catch (err) { window.alert(err.response?.data?.message || "Không lưu được tổ hợp môn"); }
  };
  const saveMethod = async (item) => {
    try {
      if (!item.method_code?.trim() || !item.method_name?.trim())
        return window.alert("Vui lòng nhập mã phương thức và tên phương thức");
      const p = { methodCode: item.method_code.trim(), methodName: item.method_name.trim(), isActive: item.is_active ? 1 : 0 };
      item.id ? await updateAdmissionMethod(item.id, p) : await createAdmissionMethod(p);
      await loadData();
    } catch (err) { window.alert(err.response?.data?.message || "Không lưu được phương thức xét tuyển"); }
  };
  const removeSchool      = async (item) => { try { await deleteHighSchool(item.id);           await loadData(); } catch (err) { window.alert(err.response?.data?.message || "Không xóa được"); } };
  const removeMajor       = async (item) => { try { await deleteMajor(item.id);                await loadData(); } catch (err) { window.alert(err.response?.data?.message || "Không xóa được"); } };
  const removeCombination = async (item) => { try { await deleteSubjectCombination(item.id);   await loadData(); } catch (err) { window.alert(err.response?.data?.message || "Không xóa được"); } };
  const removeMethod      = async (item) => { try { await deleteAdmissionMethod(item.id);      await loadData(); } catch (err) { window.alert(err.response?.data?.message || "Không xóa được"); } };

  if (loading) {
    return (
      <div className="catalog-loading">
        <div className="catalog-loading-spinner" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  const tabContent = {
    schools: (
      <CatalogTab
        columns={schoolColumns}
        items={schools}
        onFieldChange={updateItem(setSchools)}
        onSave={saveSchool}
        onDelete={removeSchool}
        onAdd={() => setSchools((p) => [...p, createEmptySchool()])}
      />
    ),
    majors: (
      <CatalogTab
        columns={majorColumns}
        items={majors}
        onFieldChange={updateItem(setMajors)}
        onSave={saveMajor}
        onDelete={removeMajor}
        onAdd={() => setMajors((p) => [...p, createEmptyMajor()])}
      />
    ),
    combinations: (
      <CatalogTab
        columns={combinationColumns}
        items={subjectCombinations}
        onFieldChange={updateItem(setSubjectCombinations)}
        onSave={saveCombination}
        onDelete={removeCombination}
        onAdd={() => setSubjectCombinations((p) => [...p, createEmptyCombination()])}
      />
    ),
    methods: (
      <CatalogTab
        columns={methodColumns}
        items={methods}
        onFieldChange={updateItem(setMethods)}
        onSave={saveMethod}
        onDelete={removeMethod}
        onAdd={() => setMethods((p) => [...p, createEmptyMethod()])}
      />
    ),
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Page header */}
      <div className="card section-card">
        <div className="card-body">
          <div className="catalog-page-header">
            <div>
              <h1 className="catalog-page-title">Quản lý danh mục tuyển sinh</h1>
              <p className="small-muted mb-0">
                Quản lý trường THPT, ngành, tổ hợp môn và phương thức xét tuyển.
              </p>
            </div>
            <Link className="btn btn-outline-secondary btn-sm" to="/admin/dashboard">
              ← Quay lại
            </Link>
          </div>
        </div>
      </div>

      {/* Tab panel */}
      <div className="card section-card ctab-panel">
        {/* Tab list */}
        <div className="ctab-list">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`ctab-item ${activeTab === tab.key ? "ctab-item--active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="ctab-item-icon">{tab.icon}</span>
              <span className="ctab-item-label">{tab.label}</span>
              <span className="ctab-item-count">{counts[tab.key]}</span>
            </button>
          ))}
        </div>

        {/* Active tab content */}
        {tabContent[activeTab]}
      </div>
    </div>
  );
}
export default function PreferenceTable({
  preferences,
  onChange,
  onAdd,
  onRemove,
  majorOptions = [],
  subjectCombinationOptions = [],
  selectedMethodLabel = "",
}) {
  const handleMajorChange = (index, majorCode) => {
    const major = majorOptions.find(
      (item) => String(item.code) === String(majorCode)
    );

    onChange(index, "institutionCode", "DBL");
    onChange(index, "institutionName", "Trường Đại học Bạc Liêu");
    onChange(index, "majorCode", major?.code || "");
    onChange(index, "majorName", major?.name || "");
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle table-themed table-compact">
        <thead className="table-head-soft">
          <tr>
            <th style={{ width: 80 }}>NV</th>
            <th style={{ minWidth: 260 }}>Ngành đăng ký</th>
            <th style={{ width: 140 }}>Mã ngành</th>
            <th style={{ minWidth: 180 }}>Tổ hợp</th>
            <th style={{ minWidth: 220 }}>Phương thức xét tuyển</th>
            <th style={{ width: 90 }}></th>
          </tr>
        </thead>
        <tbody>
          {preferences.map((row, index) => (
            <tr key={`preference-${index}`}>
              <td>
                <input
                  className="form-control"
                  value={row.priorityOrder}
                  onChange={(event) =>
                    onChange(index, "priorityOrder", event.target.value)
                  }
                />
              </td>

              <td>
                <select
                  className="form-select"
                  value={row.majorCode || ""}
                  onChange={(event) =>
                    handleMajorChange(index, event.target.value)
                  }
                >
                  <option value="">-- Chọn ngành --</option>
                  {majorOptions.map((major) => (
                    <option key={major.code} value={major.code}>
                      {major.name}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                <input
                  className="form-control readonly-input"
                  value={row.majorCode || ""}
                  readOnly
                  placeholder="Tự động"
                />
              </td>

              <td>
                <select
                  className="form-select"
                  value={row.subjectCombinationCode || ""}
                  onChange={(event) =>
                    onChange(
                      index,
                      "subjectCombinationCode",
                      event.target.value
                    )
                  }
                >
                  <option value="">-- Chọn tổ hợp --</option>
                  {subjectCombinationOptions.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} - {item.name}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                <input
                  className="form-control readonly-input"
                  value={selectedMethodLabel}
                  readOnly
                  placeholder="Chọn ở mục phương thức xét tuyển"
                />
              </td>

              <td className="text-nowrap">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onRemove(index)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={onAdd}
        >
          + Thêm nguyện vọng
        </button>
      </div>
    </div>
  );
}

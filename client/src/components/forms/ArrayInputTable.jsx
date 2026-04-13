export default function ArrayInputTable({ title, rows, columns, onChange, onAdd, onRemove }) {
  return (
    <div>
      {title ? <h6 className="fw-bold mb-3">{title}</h6> : null}
      <div className="table-responsive">
        <table className="table table-bordered align-middle table-themed">
          <thead className="table-head-soft">
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${title || 'row'}-${index}`}>
                {columns.map((column) => (
                  <td key={`${index}-${column.key}`}>
                    <input
                      type={column.type || 'text'}
                      className="form-control"
                      value={row[column.key] || ''}
                      onChange={(event) => onChange(index, column.key, event.target.value)}
                    />
                  </td>
                ))}
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
      </div>

      <button type="button" className="btn btn-outline-primary" onClick={onAdd}>
        + Thêm dòng
      </button>
    </div>
  );
}

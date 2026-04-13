import { REPORT_CARD_SUBJECTS } from "../../utils/defaults";

const columns = [
  { key: "10_HK1", label: "Lớp 10 - HK1" },
  { key: "10_HK2", label: "Lớp 10 - HK2" },
  { key: "11_HK1", label: "Lớp 11 - HK1" },
  { key: "11_HK2", label: "Lớp 11 - HK2" },
  { key: "12_HK1", label: "Lớp 12 - HK1" },
  { key: "12_HK2", label: "Lớp 12 - HK2" },
];

export default function SemesterScoreGrid({ scores, onChange }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle table-themed table-compact">
        <thead className="table-head-soft">
          <tr>
            <th style={{ minWidth: 180 }}>Môn học</th>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {REPORT_CARD_SUBJECTS.map((subject) => (
            <tr key={subject.code}>
              <td className="fw-semibold">{subject.label}</td>
              {columns.map((column) => (
                <td key={`${subject.code}-${column.key}`}>
                  <input
                    className="form-control"
                    value={scores?.[subject.code]?.[column.key] || ""}
                    onChange={(event) =>
                      onChange(subject.code, column.key, event.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

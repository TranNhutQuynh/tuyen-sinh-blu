import { useState, useCallback } from "react";
import {
  ACADEMIC_OPTIONS,
  calculateYearScore,
  CONDUCT_OPTIONS,
  FOREIGN_LANGUAGE_OPTIONS,
  REPORT_CARD_SUBJECTS,
} from "../../utils/defaults";

const YEAR_CONFIGS = [
  {
    year: "10",
    title: "Năm lớp 10",
    badge: "2022–2023",
    bandClass: "rc-band--10",
    tabClass: "rc-tab--10",
    academicField: "academic10Year",
    conductField: "conduct10Year",
    foreignLanguageField: "foreignLanguage10",
  },
  {
    year: "11",
    title: "Năm lớp 11",
    badge: "2023–2024",
    bandClass: "rc-band--11",
    tabClass: "rc-tab--11",
    academicField: "academic11Year",
    conductField: "conduct11Year",
    foreignLanguageField: "foreignLanguage11",
  },
  {
    year: "12",
    title: "Năm lớp 12",
    badge: "2024–2025",
    bandClass: "rc-band--12",
    tabClass: "rc-tab--12",
    academicField: "academic12Year",
    conductField: "conduct12Year",
    foreignLanguageField: "foreignLanguage12",
  },
];

/* ─── Icons ─── */
function IconAlert() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      style={{ flexShrink: 0, marginTop: 1 }}
    >
      <circle cx="8" cy="8" r="7" />
      <line x1="8" y1="5" x2="8" y2="8.5" />
      <circle cx="8" cy="11" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      style={{ flexShrink: 0, marginTop: 1 }}
    >
      <circle cx="8" cy="8" r="7" />
      <polyline points="5,8.5 7,10.5 11,6" />
    </svg>
  );
}

/* ─── Hooks ─── */
function useYearStats(scores, reportCard) {
  const getFilledCount = useCallback(
    (year) => {
      let count = 0;

      REPORT_CARD_SUBJECTS.forEach((subject) => {
        const hk1 = scores?.[subject.code]?.[`${year}_HK1`] ?? "";
        const hk2 = scores?.[subject.code]?.[`${year}_HK2`] ?? "";

        if (hk1 !== "" && hk2 !== "") count++;
      });

      return count;
    },
    [scores]
  );

  const getStatus = useCallback(
    (config) => {
      const filled = getFilledCount(config.year);
      const hasAcademic = !!reportCard?.[config.academicField];
      const hasConduct = !!reportCard?.[config.conductField];

      if (filled === 0 && !hasAcademic && !hasConduct) return "empty";
      if (filled === REPORT_CARD_SUBJECTS.length && hasAcademic && hasConduct) {
        return "done";
      }

      return "partial";
    },
    [getFilledCount, reportCard]
  );

  const getMissing = useCallback(
    (config) => {
      const missing = [];

      REPORT_CARD_SUBJECTS.forEach((subject) => {
        const hk1 = scores?.[subject.code]?.[`${config.year}_HK1`] ?? "";
        const hk2 = scores?.[subject.code]?.[`${config.year}_HK2`] ?? "";

        if (hk1 === "" || hk2 === "") {
          missing.push(subject.label);
        }
      });

      if (!reportCard?.[config.academicField]) missing.push("Học lực");
      if (!reportCard?.[config.conductField]) missing.push("Hạnh kiểm");

      return missing;
    },
    [scores, reportCard]
  );

  return { getFilledCount, getStatus, getMissing };
}

/* ─── Sub-components ─── */
function SummaryBar({ configs, getStatus, getFilledCount }) {
  let emptyCount = 0;
  let partialCount = 0;
  let doneCount = 0;
  let totalFilled = 0;

  configs.forEach((config) => {
    const status = getStatus(config);

    if (status === "empty") emptyCount++;
    else if (status === "partial") partialCount++;
    else doneCount++;

    totalFilled += getFilledCount(config.year);
  });

  const totalSubjects = REPORT_CARD_SUBJECTS.length * configs.length;

  return (
    <div className="rc-summary-bar d-flex flex-wrap gap-2 align-items-center">
      <span className="rc-summary-seg">
        <span className="rc-seg-dot rc-seg-dot--empty" />
        {emptyCount} năm chưa nhập
      </span>

      <span className="rc-summary-seg">
        <span className="rc-seg-dot rc-seg-dot--partial" />
        {partialCount} năm nhập một phần
      </span>

      <span className="rc-summary-seg">
        <span className="rc-seg-dot rc-seg-dot--done" />
        {doneCount} năm hoàn tất
      </span>

      <span className="rc-summary-total ms-md-auto">
        {totalFilled} / {totalSubjects} môn đã nhập
      </span>
    </div>
  );
}

function YearTab({ config, isActive, status, filledCount, onClick }) {
  const total = REPORT_CARD_SUBJECTS.length;
  const pct = status === "done" ? 100 : Math.round((filledCount / total) * 100);

  const badgeText =
    status === "done"
      ? "Hoàn tất"
      : status === "partial"
      ? `${filledCount}/${total} môn`
      : "Chưa nhập";

  return (
    <button
      type="button"
      className={`rc-tab ${config.tabClass}${
        isActive ? " rc-tab--active" : ""
      }`}
      onClick={onClick}
    >
      <div className="rc-tab-inner">
        <div className="rc-tab-top">
          <span className="rc-tab-label">Lớp {config.year}</span>
          <span className={`rc-tab-badge rc-tab-badge--${status}`}>
            {badgeText}
          </span>
        </div>

        <div className="rc-prog-bar">
          <div
            className={`rc-prog-fill rc-prog-fill--${status}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </button>
  );
}

function AlertBanner({ status, missing, showMissing }) {
  if (status === "done") {
    return (
      <div className="rc-alert rc-alert--ok">
        <IconCheck />
        <span>Đã nhập đầy đủ thông tin cho năm học này.</span>
      </div>
    );
  }

  if (showMissing && missing.length > 0) {
    const shown = missing.slice(0, 5);
    const rest = missing.length - 5;

    return (
      <div className="rc-alert rc-alert--warn">
        <IconAlert />
        <span>
          Còn <strong>{missing.length} mục chưa điền</strong>:{" "}
          {shown.join(", ")}
          {rest > 0 ? ` và ${rest} mục khác` : ""}
        </span>
      </div>
    );
  }

  return null;
}

function ScoreRow({
  config,
  subject,
  scores,
  showMissing,
  onScoreChange,
  onFieldChange,
}) {
  const hk1Key = `${config.year}_HK1`;
  const hk2Key = `${config.year}_HK2`;

  const hk1Value = scores?.[subject.code]?.[hk1Key] ?? "";
  const hk2Value = scores?.[subject.code]?.[hk2Key] ?? "";
  const yearValue = calculateYearScore(hk1Value, hk2Value);
  const isForeignLanguage = subject.code === "NN";

  const yNum = parseFloat(yearValue);
  const totalMod = !Number.isNaN(yNum)
    ? yNum >= 8
      ? "great"
      : yNum >= 6.5
      ? "ok"
      : yNum >= 5
      ? "warn"
      : "fail"
    : "";

  return (
    <tr>
      <td className="rc-td-subject">
        <div className="rc-subject-wrap">
          <span className="rc-subject-label">{subject.label}</span>

          {isForeignLanguage ? (
            <select
              className="rc-lang-select"
              value={scores?.[config.foreignLanguageField] ?? ""}
              onChange={(event) =>
                onFieldChange(config.foreignLanguageField, event.target.value)
              }
            >
              {FOREIGN_LANGUAGE_OPTIONS.map((item) => (
                <option key={item.value || "empty"} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </td>

      <td>
        <input
          className={`rc-score-input${
            showMissing && hk1Value === "" ? " rc-score-input--missing" : ""
          }`}
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="—"
          value={hk1Value}
          onChange={(event) =>
            onScoreChange(subject.code, hk1Key, event.target.value)
          }
        />
      </td>

      <td>
        <input
          className={`rc-score-input${
            showMissing && hk2Value === "" ? " rc-score-input--missing" : ""
          }`}
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="—"
          value={hk2Value}
          onChange={(event) =>
            onScoreChange(subject.code, hk2Key, event.target.value)
          }
        />
      </td>

      <td>
        <input
          className={`rc-score-total${
            totalMod ? ` rc-score-total--${totalMod}` : ""
          }`}
          value={yearValue}
          readOnly
          placeholder="Tự tính"
        />
      </td>
    </tr>
  );
}

/* ─── Main component ─── */
export default function ReportCardYearPanels({
  scores,
  reportCard,
  onScoreChange,
  onFieldChange,
}) {
  const [activeYear, setActiveYear] = useState("10");
  const [touchedYears, setTouchedYears] = useState(new Set());

  const { getFilledCount, getStatus, getMissing } = useYearStats(
    scores,
    reportCard
  );

  const handleTabClick = (year) => {
    setTouchedYears((prev) => new Set([...prev, activeYear]));
    setActiveYear(year);
  };

  return (
    <div className="rc-wrapper">
      <SummaryBar
        configs={YEAR_CONFIGS}
        getStatus={getStatus}
        getFilledCount={getFilledCount}
      />

      <div className="rc-tabs d-flex flex-wrap gap-2">
        {YEAR_CONFIGS.map((config) => (
          <YearTab
            key={config.year}
            config={config}
            isActive={activeYear === config.year}
            status={getStatus(config)}
            filledCount={getFilledCount(config.year)}
            onClick={() => handleTabClick(config.year)}
          />
        ))}
      </div>

      {YEAR_CONFIGS.map((config) => {
        const status = getStatus(config);
        const missing = getMissing(config);
        const showMissing = touchedYears.has(config.year) && status !== "done";
        const acMissing = showMissing && !reportCard?.[config.academicField];
        const cdMissing = showMissing && !reportCard?.[config.conductField];

        return (
          <div
            key={config.year}
            className={`rc-panel${
              activeYear === config.year ? " rc-panel--active" : ""
            }`}
            style={{ display: activeYear === config.year ? "block" : "none" }}
          >
            <div className="rc-card overflow-hidden">
              <div className={`rc-band ${config.bandClass}`}>
                <div className="rc-band-num">{config.year}</div>
                <span className="rc-band-title">{config.title}</span>
                <span className="rc-band-right">{config.badge}</span>
              </div>

              <div className="rc-body">
                <AlertBanner
                  status={status}
                  missing={missing}
                  showMissing={showMissing}
                />

                <div className="small-muted mb-3 d-block d-md-none">
                  Vuốt ngang bảng để xem đầy đủ các cột.
                </div>

                <div className="rc-table-wrap table-responsive">
                  <table className="rc-table table align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="col-subject">Môn học</th>
                        <th className="col-score">Học kỳ 1</th>
                        <th className="col-score">Học kỳ 2</th>
                        <th className="col-score">Cả năm</th>
                      </tr>
                    </thead>

                    <tbody>
                      {REPORT_CARD_SUBJECTS.map((subject) => (
                        <ScoreRow
                          key={subject.code}
                          config={config}
                          subject={subject}
                          scores={scores}
                          showMissing={showMissing}
                          onScoreChange={onScoreChange}
                          onFieldChange={onFieldChange}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rc-divider" />

                <div className="row g-3 rc-footer-grid">
                  <div className="col-12 col-md-6">
                    <div className="rc-field">
                      <label className="rc-field-label">Học lực cả năm</label>
                      <select
                        className={`rc-select${
                          acMissing ? " rc-select--missing" : ""
                        }`}
                        value={reportCard?.[config.academicField] ?? ""}
                        onChange={(event) =>
                          onFieldChange(
                            config.academicField,
                            event.target.value
                          )
                        }
                      >
                        {ACADEMIC_OPTIONS.map((item) => (
                          <option
                            key={item.value || "empty"}
                            value={item.value}
                          >
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="rc-field">
                      <label className="rc-field-label">Hạnh kiểm cả năm</label>
                      <select
                        className={`rc-select${
                          cdMissing ? " rc-select--missing" : ""
                        }`}
                        value={reportCard?.[config.conductField] ?? ""}
                        onChange={(event) =>
                          onFieldChange(config.conductField, event.target.value)
                        }
                      >
                        {CONDUCT_OPTIONS.map((item) => (
                          <option
                            key={item.value || "empty"}
                            value={item.value}
                          >
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
                  <div className="small-muted">
                    Đang nhập dữ liệu cho <strong>{config.title}</strong>
                  </div>

                  <div className="small-muted">
                    {getFilledCount(config.year)}/{REPORT_CARD_SUBJECTS.length}{" "}
                    môn đã nhập đủ
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

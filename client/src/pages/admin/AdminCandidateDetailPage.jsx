import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCandidateDetail } from "../../api/adminApi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const REPORT_CARD_SUBJECT_LABELS = {
  VA: "Ngữ văn",
  TO: "Toán",
  NN: "Ngoại ngữ",
  LI: "Vật lí",
  HO: "Hóa học",
  SI: "Sinh học",
  SU: "Lịch sử",
  DI: "Địa lí",
  KTPL: "Giáo dục KT&PL",
  CNCN: "Công nghệ CN",
  CNNN: "Công nghệ NN",
  TI: "Tin học",
  GDCD: "GD công dân",
};

const THPT_SUBJECT_LABELS = {
  CTO: "Toán",
  CVA: "Ngữ văn",
  CLI: "Vật lí",
  CHO: "Hóa học",
  CSI: "Sinh học",
  CSU: "Lịch sử",
  CDI: "Địa lí",
  CGD: "GDCD",
  CNN: "Ngoại ngữ",
};

function toText(value) {
  return value || "—";
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
}

function normalizeScore(value) {
  if (value === null || value === undefined || value === "") return "";
  const parsed = Number(String(value).replace(",", "."));
  return Number.isNaN(parsed) ? "" : parsed;
}

function calculateYearScore(hk1, hk2) {
  const score1 = normalizeScore(hk1);
  const score2 = normalizeScore(hk2);

  if (score1 === "" && score2 === "") return "";
  if (score1 === "" && score2 !== "") return score2.toFixed(2);
  if (score1 !== "" && score2 === "") return score1.toFixed(2);

  return ((score1 + score2 * 2) / 3).toFixed(2);
}

function buildEvidenceUrl(file) {
  if (!file?.filename) return "";
  const origin = API_BASE_URL.replace(/\/api$/, "");
  return `${origin}/uploads/report-card-evidence/${file.filename}`;
}

function isImageFile(file) {
  const name = String(file?.originalName || file?.filename || "").toLowerCase();
  return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(name);
}

function isPdfFile(file) {
  const name = String(file?.originalName || file?.filename || "").toLowerCase();
  return /\.pdf$/i.test(name);
}

function renderMethodName(candidate) {
  return (
    candidate?.personalInfo?.selectedAdmissionMethod ||
    candidate?.preferences?.[0]?.admissionMethodCode ||
    ""
  );
}

/* Component phụ viết ngay trong file này */
function ReportCardYearTable({
  title,
  scores,
  yearKeyPrefix,
  foreignLanguage,
}) {
  const subjectCodes = Object.keys(scores || {});

  if (!subjectCodes.length) {
    return (
      <div className="card section-card">
        <div className="card-body">
          <h3 className="h6 mb-0">{title}</h3>
          <div className="text-muted mt-2">Chưa có dữ liệu.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card section-card">
      <div className="card-body">
        <h3 className="h6 mb-3">{title}</h3>

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Môn học</th>
                <th>HK1</th>
                <th>HK2</th>
                <th>Cả năm</th>
              </tr>
            </thead>
            <tbody>
              {subjectCodes.map((subjectCode) => {
                const row = scores[subjectCode] || {};
                const hk1 = row[`${yearKeyPrefix}_HK1`] || "";
                const hk2 = row[`${yearKeyPrefix}_HK2`] || "";
                const caNamStored =
                  row[`${yearKeyPrefix}_CN`] ||
                  row[`${yearKeyPrefix}_YEAR`] ||
                  "";
                const caNam = caNamStored || calculateYearScore(hk1, hk2);

                return (
                  <tr key={`${yearKeyPrefix}-${subjectCode}`}>
                    <td>
                      <div className="fw-semibold">
                        {REPORT_CARD_SUBJECT_LABELS[subjectCode] || subjectCode}
                      </div>
                      {subjectCode === "NN" && foreignLanguage ? (
                        <div className="small text-muted">
                          Ngoại ngữ chọn: {foreignLanguage}
                        </div>
                      ) : null}
                    </td>
                    <td>{toText(hk1)}</td>
                    <td>{toText(hk2)}</td>
                    <td>{toText(caNam)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminCandidateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await getCandidateDetail(id);
        setCandidate(result.data);
      } catch (error) {
        window.alert(error.response?.data?.message || "Không tải được hồ sơ");
        navigate("/admin/candidates");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  if (loading) {
    return <div>Đang tải hồ sơ...</div>;
  }

  if (!candidate) {
    return <div>Không có dữ liệu hồ sơ.</div>;
  }

  const preferences = candidate.preferences || [];
  const reportCardFiles = candidate.reportCard?.evidenceFiles || [];
  const gdnlRows = candidate.gdnl || [];
  const vsatRows = candidate.vsat || [];
  const thptExam = candidate.thptExam || {};
  const reportCard = candidate.reportCard || {};
  const selectedMethod = renderMethodName(candidate);

  return (
    <div className="d-flex flex-column gap-4">
      <div className="card section-card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="h4 mb-1">Xem hồ sơ thí sinh</h1>
              <div className="small-muted">
                Kiểm tra hồ sơ trước khi chuyển sang chỉnh sửa.
              </div>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <Link
                className="btn btn-outline-secondary"
                to="/admin/candidates"
              >
                ← Quay lại danh sách
              </Link>
              <Link
                className="btn btn-primary"
                to={`/admin/candidates/${id}/edit`}
              >
                Chỉnh sửa hồ sơ
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card section-card">
        <div className="card-body">
          <h2 className="h5 mb-3">Thông tin thí sinh</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <strong>Họ và tên:</strong> {toText(candidate.fullName)}
            </div>
            <div className="col-md-3">
              <strong>CCCD:</strong> {toText(candidate.nationalId)}
            </div>
            <div className="col-md-3">
              <strong>SBD:</strong> {toText(candidate.examNumber)}
            </div>

            <div className="col-md-3">
              <strong>Ngày sinh:</strong> {formatDate(candidate.birthDate)}
            </div>
            <div className="col-md-3">
              <strong>Giới tính:</strong> {toText(candidate.gender)}
            </div>
            <div className="col-md-3">
              <strong>Điện thoại:</strong> {toText(candidate.phone)}
            </div>
            <div className="col-md-3">
              <strong>Email:</strong> {toText(candidate.email)}
            </div>

            <div className="col-md-3">
              <strong>Năm tốt nghiệp:</strong>{" "}
              {toText(candidate.graduationYear)}
            </div>
            <div className="col-md-3">
              <strong>Trường THPT:</strong> {toText(candidate.schoolName)}
            </div>
            <div className="col-md-3">
              <strong>Khu vực ưu tiên:</strong>{" "}
              {toText(candidate.priorityAreaCode)}
            </div>
            <div className="col-md-3">
              <strong>Đối tượng ưu tiên:</strong>{" "}
              {toText(candidate.priorityObjectCode)}
            </div>

            <div className="col-12">
              <strong>Địa chỉ:</strong>{" "}
              {toText(candidate.personalInfo?.address)}
            </div>
          </div>
        </div>
      </div>

      <div className="card section-card">
        <div className="card-body">
          <h2 className="h5 mb-3">Nguyện vọng đăng ký</h2>

          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>NV</th>
                  <th>Ngành</th>
                  <th>Mã ngành</th>
                  <th>Tổ hợp</th>
                  <th>Phương thức</th>
                </tr>
              </thead>
              <tbody>
                {preferences.length ? (
                  preferences.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{item.priorityOrder}</td>
                      <td>{item.majorName}</td>
                      <td>{item.majorCode}</td>
                      <td>{item.subjectCombinationCode}</td>
                      <td>{item.admissionMethodName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      Chưa có nguyện vọng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedMethod === "thptExam" ? (
        <div className="card section-card">
          <div className="card-body">
            <h2 className="h5 mb-3">Dữ liệu điểm thi THPT</h2>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <strong>Học lực lớp 12:</strong>{" "}
                {toText(thptExam.academicPerformance12)}
              </div>
              <div className="col-md-4">
                <strong>Hạnh kiểm lớp 12:</strong> {toText(thptExam.conduct12)}
              </div>
              <div className="col-md-4">
                <strong>Điểm TB lớp 12:</strong> {toText(thptExam.average12)}
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Môn</th>
                    <th>Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(thptExam.subjects || {}).length ? (
                    Object.entries(thptExam.subjects || {}).map(
                      ([code, value]) => (
                        <tr key={code}>
                          <td>{THPT_SUBJECT_LABELS[code] || code}</td>
                          <td>{toText(value)}</td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center text-muted">
                        Chưa có điểm THPT
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {selectedMethod === "reportCard" ? (
        <>
          <div className="card section-card">
            <div className="card-body">
              <h2 className="h5 mb-3">Tổng quan học bạ</h2>
              <div className="row g-3">
                <div className="col-md-3">
                  <strong>Học lực lớp 10:</strong>{" "}
                  {toText(reportCard.academic10Year)}
                </div>
                <div className="col-md-3">
                  <strong>Hạnh kiểm lớp 10:</strong>{" "}
                  {toText(reportCard.conduct10Year)}
                </div>
                <div className="col-md-3">
                  <strong>Học lực lớp 11:</strong>{" "}
                  {toText(reportCard.academic11Year)}
                </div>
                <div className="col-md-3">
                  <strong>Hạnh kiểm lớp 11:</strong>{" "}
                  {toText(reportCard.conduct11Year)}
                </div>
                <div className="col-md-3">
                  <strong>Học lực lớp 12:</strong>{" "}
                  {toText(reportCard.academic12Year)}
                </div>
                <div className="col-md-3">
                  <strong>Hạnh kiểm lớp 12:</strong>{" "}
                  {toText(reportCard.conduct12Year)}
                </div>
              </div>
            </div>
          </div>

          <ReportCardYearTable
            title="Điểm học bạ lớp 10"
            scores={reportCard.scores}
            yearKeyPrefix="10"
            foreignLanguage={reportCard.foreignLanguage10}
          />

          <ReportCardYearTable
            title="Điểm học bạ lớp 11"
            scores={reportCard.scores}
            yearKeyPrefix="11"
            foreignLanguage={reportCard.foreignLanguage11}
          />

          <ReportCardYearTable
            title="Điểm học bạ lớp 12"
            scores={reportCard.scores}
            yearKeyPrefix="12"
            foreignLanguage={reportCard.foreignLanguage12}
          />

          <div className="card section-card">
            <div className="card-body">
              <h2 className="h5 mb-3">Minh chứng học bạ</h2>

              {reportCardFiles.length ? (
                <div className="d-flex flex-column gap-3">
                  {reportCardFiles.map((file, index) => {
                    const fileUrl = buildEvidenceUrl(file);
                    const fileLabel =
                      file.originalName || file.filename || "Tệp minh chứng";

                    return (
                      <div
                        key={`${
                          file.filename || file.originalName || "file"
                        }-${index}`}
                        className="border rounded p-3"
                      >
                        <div className="mb-2 fw-semibold">{fileLabel}</div>

                        {isImageFile(file) ? (
                          <div>
                            <img
                              src={fileUrl}
                              alt={fileLabel}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "500px",
                                borderRadius: "10px",
                                border: "1px solid rgba(255,255,255,0.12)",
                              }}
                            />
                            <div className="mt-2">
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline-light"
                              >
                                Mở ảnh
                              </a>
                            </div>
                          </div>
                        ) : isPdfFile(file) ? (
                          <div>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-light"
                            >
                              Mở file PDF
                            </a>
                          </div>
                        ) : (
                          <div>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-light"
                            >
                              Tải / mở tệp
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-muted">Chưa có tệp minh chứng học bạ.</div>
              )}
            </div>
          </div>
        </>
      ) : null}

      {selectedMethod === "gdnl" ? (
        <div className="card section-card">
          <div className="card-body">
            <h2 className="h5 mb-3">Dữ liệu ĐGNL</h2>
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Đơn vị tổ chức</th>
                    <th>Đợt thi</th>
                    <th>Ngày thi</th>
                    <th>Môn / bài thi</th>
                    <th>Thang điểm</th>
                    <th>Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {gdnlRows.length ? (
                    gdnlRows.map((row, index) => (
                      <tr key={index}>
                        <td>{toText(row.organizerName)}</td>
                        <td>{toText(row.examRound)}</td>
                        <td>{formatDate(row.examDate)}</td>
                        <td>{toText(row.subjectName)}</td>
                        <td>{toText(row.scoreScale)}</td>
                        <td>{toText(row.score)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        Chưa có dữ liệu ĐGNL
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {selectedMethod === "vsat" ? (
        <div className="card section-card">
          <div className="card-body">
            <h2 className="h5 mb-3">Dữ liệu V-SAT</h2>
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Đơn vị tổ chức</th>
                    <th>Đợt thi</th>
                    <th>Ngày thi</th>
                    <th>Mã môn</th>
                    <th>Thang điểm</th>
                    <th>Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {vsatRows.length ? (
                    vsatRows.map((row, index) => (
                      <tr key={index}>
                        <td>{toText(row.organizerName)}</td>
                        <td>{toText(row.examRound)}</td>
                        <td>{formatDate(row.examDate)}</td>
                        <td>{toText(row.subjectCode)}</td>
                        <td>{toText(row.scoreScale)}</td>
                        <td>{toText(row.score)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        Chưa có dữ liệu V-SAT
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

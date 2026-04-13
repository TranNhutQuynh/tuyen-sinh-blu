import { useEffect, useMemo, useState } from "react";
import ArrayInputTable from "./ArrayInputTable";
import PreferenceTable from "./PreferenceTable";
import ReportCardYearPanels from "./ReportCardYearPanels";
import {
  ADMISSION_METHOD_OPTIONS,
  CERTIFICATE_FIELDS,
  cloneApplication,
  createEmptyPreference,
  DEFAULT_APPLICATION,
  getMethodById,
  MAJOR_OPTIONS_FALLBACK,
  mapMethodToPreference,
  PRIORITY_AREA_OPTIONS,
  PRIORITY_OBJECT_OPTIONS,
  SCHOOL_OPTIONS_FALLBACK,
  SUBJECT_COMBINATION_OPTIONS_FALLBACK,
  THPT_SUBJECTS,
  ACADEMIC_PERFORMANCE_OPTIONS,
  CONDUCT_GRADE_OPTIONS,
} from "../../utils/defaults";

const gdnlColumns = [
  { key: "organizerName", label: "Đơn vị tổ chức" },
  { key: "examRound", label: "Đợt thi" },
  { key: "examDate", label: "Ngày thi", type: "date" },
  { key: "subjectName", label: "Môn / bài thi" },
  { key: "scoreScale", label: "Thang điểm" },
  { key: "score", label: "Điểm" },
];

const vsatColumns = [
  { key: "organizerName", label: "Đơn vị tổ chức" },
  { key: "examRound", label: "Đợt thi" },
  { key: "examDate", label: "Ngày thi", type: "date" },
  { key: "subjectCode", label: "Mã môn V-SAT" },
  { key: "scoreScale", label: "Thang điểm" },
  { key: "score", label: "Điểm" },
];

const emptyGdnl = {
  organizerCode: "",
  organizerName: "",
  examRound: "",
  examDate: "",
  subjectCode: "",
  subjectName: "",
  scoreScale: "",
  score: "",
};

const emptyVsat = {
  organizerCode: "",
  organizerName: "",
  examRound: "",
  examDate: "",
  subjectCode: "",
  scoreScale: "",
  score: "",
};

function normalizeInitialData(payload) {
  const cloned = cloneApplication(payload || DEFAULT_APPLICATION);
  cloned.personalInfo = {
    ...DEFAULT_APPLICATION.personalInfo,
    ...(cloned.personalInfo || {}),
  };

  if (!cloned.personalInfo.selectedAdmissionMethod) {
    cloned.personalInfo.selectedAdmissionMethod = "reportCard";
  }

  return cloned;
}

function buildPayload(form) {
  return {
    applicationCode: form.applicationCode,
    fullName: form.fullName,
    nationalId: form.nationalId,
    birthDate: form.birthDate,
    gender: form.gender,
    phone: form.phone,
    email: form.email,
    graduationYear: form.graduationYear,
    examNumber: form.examNumber,
    ethnicCode: form.ethnicCode,
    ethnicName: form.ethnicName,
    priorityObjectCode: form.priorityObjectCode,
    priorityAreaCode: form.priorityAreaCode,
    schoolCode: form.schoolCode,
    schoolName: form.schoolName,
    birthPlace: form.birthPlace,
    provinceCode: form.provinceCode,
    districtCode: form.districtCode,
    wardCode: form.wardCode,
    personalInfo: {
      ...form.personalInfo,
    },
    preferences: form.preferences,
    thptExam: form.thptExam,
    reportCard: form.reportCard,
    gdnl: form.gdnl,
    vsat: form.vsat,
  };
}

function SectionTitle({ number, title, hint }) {
  return (
    <div className="section-title-row">
      <div className="section-number">{number}</div>
      <div>
        <h3 className="section-title-text">{title}</h3>
        {hint ? <p className="section-hint mb-0">{hint}</p> : null}
      </div>
    </div>
  );
}

const isEmpty = (value) => !String(value || "").trim();

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
};

const isValidPhone = (value) => {
  return /^0\d{9,10}$/.test(String(value || "").trim());
};

const isValidNationalId = (value) => {
  return /^\d{9}$|^\d{12}$/.test(String(value || "").trim());
};

const isValidExamNumber = (value) => {
  return /^[A-Za-z0-9]+$/.test(String(value || "").trim());
};

const isValidGraduationYear = (value) => {
  return /^(20)\d{2}$/.test(String(value || "").trim());
};

const isValidBirthDate = (value) => {
  if (!value) return false;
  const inputDate = new Date(value);
  const today = new Date();
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(inputDate.getTime()) && inputDate <= today;
};

const validateCandidateInfo = (form) => {
  const newErrors = {};

  if (isEmpty(form.fullName)) {
    newErrors.fullName = "Vui lòng nhập họ và tên";
  } else if (String(form.fullName).trim().length < 2) {
    newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
  }

  if (isEmpty(form.nationalId)) {
    newErrors.nationalId = "Vui lòng nhập CCCD/ĐDCN";
  } else if (!isValidNationalId(form.nationalId)) {
    newErrors.nationalId = "CCCD/ĐDCN phải gồm 9 hoặc 12 chữ số";
  }

  if (isEmpty(form.examNumber)) {
    newErrors.examNumber = "Vui lòng nhập số báo danh THPT";
  } else if (!isValidExamNumber(form.examNumber)) {
    newErrors.examNumber = "Số báo danh chỉ được gồm chữ và số";
  }

  if (isEmpty(form.birthDate)) {
    newErrors.birthDate = "Vui lòng chọn ngày sinh";
  } else if (!isValidBirthDate(form.birthDate)) {
    newErrors.birthDate = "Ngày sinh không hợp lệ";
  }

  if (isEmpty(form.gender)) {
    newErrors.gender = "Vui lòng chọn giới tính";
  }

  if (isEmpty(form.phone)) {
    newErrors.phone = "Vui lòng nhập số điện thoại";
  } else if (!isValidPhone(form.phone)) {
    newErrors.phone = "Số điện thoại không hợp lệ";
  }

  if (isEmpty(form.email)) {
    newErrors.email = "Vui lòng nhập email";
  } else if (!isValidEmail(form.email)) {
    newErrors.email = "Email không đúng định dạng";
  }

  if (isEmpty(form.graduationYear)) {
    newErrors.graduationYear = "Vui lòng nhập năm tốt nghiệp";
  } else if (!isValidGraduationYear(form.graduationYear)) {
    newErrors.graduationYear = "Năm tốt nghiệp phải gồm 4 chữ số";
  }

  if (isEmpty(form.schoolCode)) {
    newErrors.schoolCode = "Vui lòng chọn trường THPT";
  }

  if (isEmpty(form.priorityAreaCode)) {
    newErrors.priorityAreaCode = "Vui lòng chọn khu vực ưu tiên";
  }

  if (isEmpty(form.priorityObjectCode)) {
    newErrors.priorityObjectCode = "Vui lòng chọn đối tượng ưu tiên";
  }

  if (isEmpty(form.personalInfo?.address)) {
    newErrors.address = "Vui lòng nhập địa chỉ";
  } else if (String(form.personalInfo.address).trim().length < 5) {
    newErrors.address = "Địa chỉ quá ngắn";
  }

  return newErrors;
};
const isBlank = (value) => String(value ?? "").trim() === "";

const isValidNumber = (value) => {
  if (value === null || value === undefined || value === "") return false;
  return !Number.isNaN(Number(String(value).replace(",", ".")));
};

const hasPreferenceData = (preferences = []) => {
  return (
    Array.isArray(preferences) &&
    preferences.some((item) => {
      return !isBlank(item.majorCode) && !isBlank(item.subjectCombinationCode);
    })
  );
};

const validatePreferences = (preferences = []) => {
  if (!Array.isArray(preferences) || preferences.length === 0) {
    return "Vui lòng nhập ít nhất 1 nguyện vọng.";
  }

  for (let i = 0; i < preferences.length; i += 1) {
    const item = preferences[i];
    if (isBlank(item.majorCode)) {
      return `Nguyện vọng ${i + 1}: vui lòng chọn ngành đăng ký.`;
    }
    if (isBlank(item.subjectCombinationCode)) {
      return `Nguyện vọng ${i + 1}: vui lòng chọn tổ hợp môn.`;
    }
  }

  return "";
};

const validateThptExamData = (thptExam = {}) => {
  if (isBlank(thptExam.academicPerformance12)) {
    return "Vui lòng chọn học lực lớp 12.";
  }

  if (isBlank(thptExam.conduct12)) {
    return "Vui lòng chọn hạnh kiểm lớp 12.";
  }

  if (!isValidNumber(thptExam.average12)) {
    return "Vui lòng nhập điểm trung bình lớp 12 hợp lệ.";
  }

  const subjectValues = Object.values(thptExam.subjects || {});
  const hasAtLeastOneScore = subjectValues.some(
    (value) => !isBlank(value) && isValidNumber(value)
  );

  if (!hasAtLeastOneScore) {
    return "Vui lòng nhập ít nhất 1 điểm môn thi THPT.";
  }

  return "";
};

const validateReportCardData = (reportCard = {}) => {
  const scores = reportCard.scores || {};
  const subjects = Object.keys(scores);

  if (!subjects.length) {
    return "Thiếu dữ liệu học bạ.";
  }

  // bắt buộc có ít nhất 1 môn đủ 6 học kì
  const hasCompleteSubject = subjects.some((subjectCode) => {
    const row = scores[subjectCode] || {};
    return (
      !isBlank(row["10_HK1"]) &&
      !isBlank(row["10_HK2"]) &&
      !isBlank(row["11_HK1"]) &&
      !isBlank(row["11_HK2"]) &&
      !isBlank(row["12_HK1"]) &&
      !isBlank(row["12_HK2"]) &&
      isValidNumber(row["10_HK1"]) &&
      isValidNumber(row["10_HK2"]) &&
      isValidNumber(row["11_HK1"]) &&
      isValidNumber(row["11_HK2"]) &&
      isValidNumber(row["12_HK1"]) &&
      isValidNumber(row["12_HK2"])
    );
  });

  if (!hasCompleteSubject) {
    return "Vui lòng nhập đầy đủ điểm 6 học kì cho ít nhất 1 môn học bạ.";
  }

  if (
    isBlank(reportCard.academic10Year) ||
    isBlank(reportCard.academic11Year) ||
    isBlank(reportCard.academic12Year)
  ) {
    return "Vui lòng chọn đầy đủ học lực cả năm lớp 10, 11, 12.";
  }

  if (
    isBlank(reportCard.conduct10Year) ||
    isBlank(reportCard.conduct11Year) ||
    isBlank(reportCard.conduct12Year)
  ) {
    return "Vui lòng chọn đầy đủ hạnh kiểm cả năm lớp 10, 11, 12.";
  }

  return "";
};

const validateGdnlData = (gdnl = []) => {
  if (!Array.isArray(gdnl) || gdnl.length === 0) {
    return "Vui lòng nhập ít nhất 1 dòng dữ liệu ĐGNL.";
  }

  for (let i = 0; i < gdnl.length; i += 1) {
    const row = gdnl[i];
    if (isBlank(row.organizerName)) {
      return `Dòng ĐGNL ${i + 1}: vui lòng nhập đơn vị tổ chức.`;
    }
    if (isBlank(row.examRound)) {
      return `Dòng ĐGNL ${i + 1}: vui lòng nhập đợt thi.`;
    }
    if (isBlank(row.examDate)) {
      return `Dòng ĐGNL ${i + 1}: vui lòng chọn ngày thi.`;
    }
    if (isBlank(row.subjectName)) {
      return `Dòng ĐGNL ${i + 1}: vui lòng nhập môn/bài thi.`;
    }
    if (!isValidNumber(row.scoreScale)) {
      return `Dòng ĐGNL ${i + 1}: vui lòng nhập thang điểm hợp lệ.`;
    }
    if (!isValidNumber(row.score)) {
      return `Dòng ĐGNL ${i + 1}: vui lòng nhập điểm hợp lệ.`;
    }
  }

  return "";
};

const validateVsatData = (vsat = []) => {
  if (!Array.isArray(vsat) || vsat.length === 0) {
    return "Vui lòng nhập ít nhất 1 dòng dữ liệu V-SAT.";
  }

  for (let i = 0; i < vsat.length; i += 1) {
    const row = vsat[i];
    if (isBlank(row.organizerName)) {
      return `Dòng V-SAT ${i + 1}: vui lòng nhập đơn vị tổ chức.`;
    }
    if (isBlank(row.examRound)) {
      return `Dòng V-SAT ${i + 1}: vui lòng nhập đợt thi.`;
    }
    if (isBlank(row.examDate)) {
      return `Dòng V-SAT ${i + 1}: vui lòng chọn ngày thi.`;
    }
    if (isBlank(row.subjectCode)) {
      return `Dòng V-SAT ${i + 1}: vui lòng nhập mã môn.`;
    }
    if (!isValidNumber(row.scoreScale)) {
      return `Dòng V-SAT ${i + 1}: vui lòng nhập thang điểm hợp lệ.`;
    }
    if (!isValidNumber(row.score)) {
      return `Dòng V-SAT ${i + 1}: vui lòng nhập điểm hợp lệ.`;
    }
  }

  return "";
};

export default function ApplicationForm({
  initialData,
  mode = 'create',
  submitLabel = 'Lưu hồ sơ',
  onSubmit,
  submitting,
  successMessage,
  resetTrigger = 0,
  existingReportCardEvidenceFiles = [],
  schoolOptions = SCHOOL_OPTIONS_FALLBACK,
  majorOptions = MAJOR_OPTIONS_FALLBACK,
  subjectCombinationOptions = SUBJECT_COMBINATION_OPTIONS_FALLBACK,
  priorityAreaOptions = PRIORITY_AREA_OPTIONS,
  priorityObjectOptions = PRIORITY_OBJECT_OPTIONS,
}) {
  const initialValue = useMemo(
    () => normalizeInitialData(initialData || DEFAULT_APPLICATION),
    [initialData]
  );

  const [form, setForm] = useState(initialValue);
  const [formError, setFormError] = useState("");
  const [reportCardEvidenceFiles, setReportCardEvidenceFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    setForm(normalizeInitialData(initialData || DEFAULT_APPLICATION));
  }, [initialData]);
  useEffect(() => {
    if (mode !== "create") return;

    const resetValue = normalizeInitialData(DEFAULT_APPLICATION);

    setForm(resetValue);
    setFormError("");
    setErrors({});
    setReportCardEvidenceFiles([]);
    setFileInputKey((prev) => prev + 1);
  }, [resetTrigger, mode]);

  const selectedMethodId =
    form.personalInfo?.selectedAdmissionMethod || "reportCard";
  const selectedMethod = getMethodById(selectedMethodId);

  const setField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const setPersonalInfoField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      personalInfo: { ...previous.personalInfo, [field]: value },
    }));
  };

  const setSchoolByCode = (schoolCode) => {
    const school = schoolOptions.find(
      (item) => String(item.code) === String(schoolCode)
    );

    setForm((previous) => ({
      ...previous,
      schoolCode: school?.code || "",
      schoolName: school?.name || "",
    }));
  };

  const setAdmissionMethod = (methodId) => {
    const mappedMethod = mapMethodToPreference(methodId);

    setForm((previous) => ({
      ...previous,
      personalInfo: {
        ...previous.personalInfo,
        selectedAdmissionMethod: methodId,
      },
      preferences: previous.preferences.map((item) => ({
        ...item,
        ...mappedMethod,
      })),
    }));
  };

  const setThptField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      thptExam: { ...previous.thptExam, [field]: value },
    }));
  };

  const setThptSubject = (field, value) => {
    setForm((previous) => ({
      ...previous,
      thptExam: {
        ...previous.thptExam,
        subjects: { ...previous.thptExam.subjects, [field]: value },
      },
    }));
  };

  const setThptCertificate = (field, value) => {
    setForm((previous) => ({
      ...previous,
      thptExam: {
        ...previous.thptExam,
        certificates: { ...previous.thptExam.certificates, [field]: value },
      },
    }));
  };

  const setReportCardField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      reportCard: { ...previous.reportCard, [field]: value },
    }));
  };

  const setReportCardScore = (subjectCode, semesterKey, value) => {
    setForm((previous) => ({
      ...previous,
      reportCard: {
        ...previous.reportCard,
        scores: {
          ...previous.reportCard.scores,
          [subjectCode]: {
            ...previous.reportCard.scores[subjectCode],
            [semesterKey]: value,
          },
        },
      },
    }));
  };

  const setPreferenceField = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      preferences: previous.preferences.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const setGdnlField = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      gdnl: previous.gdnl.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const setVsatField = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      vsat: previous.vsat.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addPreference = () => {
    setForm((previous) => ({
      ...previous,
      preferences: [
        ...previous.preferences,
        createEmptyPreference(
          previous.preferences.length + 1,
          selectedMethodId
        ),
      ],
    }));
  };

  const removePreference = (index) => {
    setForm((previous) => ({
      ...previous,
      preferences: previous.preferences
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, idx) => ({ ...item, priorityOrder: idx + 1 })),
    }));
  };

  const addGdnl = () => {
    setForm((previous) => ({
      ...previous,
      gdnl: [...previous.gdnl, { ...emptyGdnl }],
    }));
  };

  const removeGdnl = (index) => {
    setForm((previous) => ({
      ...previous,
      gdnl: previous.gdnl.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const addVsat = () => {
    setForm((previous) => ({
      ...previous,
      vsat: [...previous.vsat, { ...emptyVsat }],
    }));
  };

  const removeVsat = (index) => {
    setForm((previous) => ({
      ...previous,
      vsat: previous.vsat.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleReportCardEvidenceChange = (event) => {
    const files = Array.from(event.target.files || []);
    setReportCardEvidenceFiles(files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const validationErrors = validateCandidateInfo(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFormError("Vui lòng kiểm tra lại thông tin thí sinh.");
      window.alert("Vui lòng kiểm tra lại thông tin thí sinh.");
      return;
    }

    const preferenceError = validatePreferences(form.preferences);
    if (preferenceError) {
      setFormError(preferenceError);
      window.alert(preferenceError);
      return;
    }

    if (selectedMethodId === "reportCard") {
      const reportCardError = validateReportCardData(form.reportCard);
      if (reportCardError) {
        setFormError(reportCardError);
        window.alert(reportCardError);
        return;
      }

      if (reportCardEvidenceFiles.length === 0 && mode === "create") {
        setFormError(
          "Nếu chọn xét học bạ thì bắt buộc phải tải ảnh minh chứng học bạ."
        );
        window.alert(
          "Nếu chọn xét học bạ thì bắt buộc phải tải ảnh minh chứng học bạ."
        );
        return;
      }
    }

    if (selectedMethodId === "thptExam") {
      const thptError = validateThptExamData(form.thptExam);
      if (thptError) {
        setFormError(thptError);
        window.alert(thptError);
        return;
      }
    }

    if (selectedMethodId === "gdnl") {
      const gdnlError = validateGdnlData(form.gdnl);
      if (gdnlError) {
        setFormError(gdnlError);
        window.alert(gdnlError);
        return;
      }
    }

    if (selectedMethodId === "vsat") {
      const vsatError = validateVsatData(form.vsat);
      if (vsatError) {
        setFormError(vsatError);
        window(vsatError);
        return;
      }
    }

    await onSubmit({
      data: buildPayload(form),
      reportCardEvidenceFiles,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="application-form">
      <div className="section-card form-main-card">
        <div className="card-body">
          <div className="form-page-head">
            <div>
              <h1 className="form-page-title">
                {mode === "edit"
                  ? "Chỉnh sửa hồ sơ thí sinh"
                  : "Phiếu nhập hồ sơ tuyển sinh"}
              </h1>
              <p className="small-muted mb-0">
                Nhập thông tin theo biểu mẫu, hệ thống sẽ xuất đúng định dạng
                Excel.
              </p>
            </div>

            {form.applicationCode ? (
              <div className="application-code-box">
                Mã hồ sơ: {form.applicationCode}
              </div>
            ) : null}
          </div>

          {successMessage ? (
            <div className="alert alert-success mt-3 mb-0">
              {successMessage}
            </div>
          ) : null}

          {formError ? (
            <div className="alert alert-warning mt-3 mb-0">{formError}</div>
          ) : null}
        </div>
      </div>

      <div className="section-card">
        <div className="card-body">
          <SectionTitle
            number="1"
            title="Thông tin thí sinh"
            hint="Các trường có danh mục thì chọn, không nhập tay."
          />

          <div className="row g-3">
            <div className="col-lg-6">
              <label className="form-label">Họ và tên</label>
              <input
                className={`form-control ${
                  errors.fullName ? "is-invalid" : ""
                }`}
                value={form.fullName}
                onChange={(event) => setField("fullName", event.target.value)}
                required
              />
              {errors.fullName ? (
                <div className="invalid-feedback">{errors.fullName}</div>
              ) : null}
            </div>

            <div className="col-md-6 col-lg-3">
              <label className="form-label">Căn cước công dân</label>
              <input
                className={`form-control ${
                  errors.nationalId ? "is-invalid" : ""
                }`}
                value={form.nationalId}
                onChange={(event) =>
                  setField("nationalId", event.target.value.replace(/\D/g, ""))
                }
                maxLength={12}
                required
              />
              {errors.nationalId ? (
                <div className="invalid-feedback">{errors.nationalId}</div>
              ) : null}
            </div>

            <div className="col-md-6 col-lg-3">
              <label className="form-label">Số báo danh THPT</label>
              <input
                className={`form-control ${
                  errors.examNumber ? "is-invalid" : ""
                }`}
                value={form.examNumber}
                onChange={(event) =>
                  setField("examNumber", event.target.value.toUpperCase())
                }
                required
              />
              {errors.examNumber ? (
                <div className="invalid-feedback">{errors.examNumber}</div>
              ) : null}
            </div>

            <div className="col-md-4 col-lg-3">
              <label className="form-label">Ngày sinh</label>
              <input
                type="date"
                className={`form-control ${
                  errors.birthDate ? "is-invalid" : ""
                }`}
                value={form.birthDate}
                onChange={(event) => setField("birthDate", event.target.value)}
                required
              />
              {errors.birthDate ? (
                <div className="invalid-feedback">{errors.birthDate}</div>
              ) : null}
            </div>

            <div className="col-md-4 col-lg-2">
              <label className="form-label">Giới tính</label>
              <select
                className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                value={form.gender}
                onChange={(event) => setField("gender", event.target.value)}
                required
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              {errors.gender ? (
                <div className="invalid-feedback">{errors.gender}</div>
              ) : null}
            </div>

            <div className="col-md-4 col-lg-3">
              <label className="form-label">Điện thoại</label>
              <input
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                value={form.phone}
                onChange={(event) =>
                  setField("phone", event.target.value.replace(/\D/g, ""))
                }
                maxLength={11}
                required
              />
              {errors.phone ? (
                <div className="invalid-feedback">{errors.phone}</div>
              ) : null}
            </div>

            <div className="col-lg-4">
              <label className="form-label">Email</label>
              <input
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                required
              />
              {errors.email ? (
                <div className="invalid-feedback">{errors.email}</div>
              ) : null}
            </div>

            <div className="col-md-4">
              <label className="form-label">Năm tốt nghiệp</label>
              <input
                className={`form-control ${
                  errors.graduationYear ? "is-invalid" : ""
                }`}
                value={form.graduationYear}
                onChange={(event) =>
                  setField(
                    "graduationYear",
                    event.target.value.replace(/\D/g, "").slice(0, 4)
                  )
                }
                maxLength={4}
                required
              />
              {errors.graduationYear ? (
                <div className="invalid-feedback">{errors.graduationYear}</div>
              ) : null}
            </div>

            <div className="col-md-4">
              <label className="form-label">Trường THPT</label>
              <select
                className={`form-select ${
                  errors.schoolCode ? "is-invalid" : ""
                }`}
                value={form.schoolCode || ""}
                onChange={(event) => setSchoolByCode(event.target.value)}
                required
              >
                <option value="">-- Chọn trường THPT --</option>
                {schoolOptions.map((school) => (
                  <option key={school.code} value={school.code}>
                    {school.name}
                  </option>
                ))}
              </select>
              {errors.schoolCode ? (
                <div className="invalid-feedback">{errors.schoolCode}</div>
              ) : null}
            </div>

            <div className="col-md-4">
              <label className="form-label">Khu vực ưu tiên</label>
              <select
                className={`form-select ${
                  errors.priorityAreaCode ? "is-invalid" : ""
                }`}
                value={form.priorityAreaCode}
                onChange={(event) =>
                  setField("priorityAreaCode", event.target.value)
                }
                required
              >
                {priorityAreaOptions.map((item) => (
                  <option key={item.code || "empty-area"} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.priorityAreaCode ? (
                <div className="invalid-feedback">
                  {errors.priorityAreaCode}
                </div>
              ) : null}
            </div>

            <div className="col-md-6">
              <label className="form-label">Địa chỉ</label>
              <input
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                value={form.personalInfo.address}
                onChange={(event) =>
                  setPersonalInfoField("address", event.target.value)
                }
                required
              />
              {errors.address ? (
                <div className="invalid-feedback">{errors.address}</div>
              ) : null}
            </div>

            <div className="col-md-6">
              <label className="form-label">Đối tượng ưu tiên</label>
              <select
                className={`form-select ${
                  errors.priorityObjectCode ? "is-invalid" : ""
                }`}
                value={form.priorityObjectCode}
                onChange={(event) =>
                  setField("priorityObjectCode", event.target.value)
                }
                required
              >
                {priorityObjectOptions.map((item) => (
                  <option key={item.code || "empty-object"} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.priorityObjectCode ? (
                <div className="invalid-feedback">
                  {errors.priorityObjectCode}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="card-body">
          <SectionTitle
            number="2"
            title="Phương thức xét tuyển"
            hint="Mỗi lần nhập chỉ chọn một phương thức."
          />

          <div className="row g-3">
            <div className="col-lg-6">
              <label className="form-label">Chọn phương thức xét tuyển</label>
              <select
                className="form-select"
                value={selectedMethodId}
                onChange={(event) => setAdmissionMethod(event.target.value)}
              >
                {ADMISSION_METHOD_OPTIONS.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-6">
              <label className="form-label">Mô tả</label>
              <input
                className="form-control readonly-input"
                value={selectedMethod?.description || ""}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="card-body">
          <SectionTitle
            number="3"
            title="Nguyện vọng đăng ký"
            hint="Thí sinh chỉ chọn ngành và tổ hợp, mã ngành sẽ tự hiện."
          />

          <PreferenceTable
            preferences={form.preferences}
            onChange={setPreferenceField}
            onAdd={addPreference}
            onRemove={removePreference}
            majorOptions={majorOptions}
            subjectCombinationOptions={subjectCombinationOptions}
            selectedMethodLabel={selectedMethod?.title || ""}
          />
        </div>
      </div>

      {selectedMethodId === "reportCard" ? (
        <div className="section-card">
          <div className="card-body">
            <SectionTitle
              number="4"
              title="Dữ liệu xét học bạ"
              hint="Nhập đúng 6 học kì, cột Cả năm tự tính theo HK1 và HK2."
            />

            <ReportCardYearPanels
              scores={form.reportCard.scores}
              reportCard={form.reportCard}
              onScoreChange={setReportCardScore}
              onFieldChange={setReportCardField}
            />

            <div className="evidence-upload-box mt-3">
              <label className="form-label">
                Ảnh minh chứng học bạ <span className="text-danger">*</span>
              </label>
              <input
                key={fileInputKey}
                type="file"
                className="form-control"
                accept="image/*,.pdf"
                multiple
                onChange={handleReportCardEvidenceChange}
              />
              <div className="form-text">
                Tải ảnh chụp hoặc file scan học bạ rõ nét. Có thể chọn nhiều
                ảnh.
              </div>

              {mode === "edit" && existingReportCardEvidenceFiles.length > 0 ? (
                <div className="mt-3">
                  <div className="form-label">Minh chứng học bạ hiện có</div>
                  <ul className="evidence-file-list">
                    {existingReportCardEvidenceFiles.map((file, index) => (
                      <li
                        key={`${
                          file.filename || file.originalName || "file"
                        }-${index}`}
                      >
                        {file.originalName || file.filename || "Tệp minh chứng"}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {reportCardEvidenceFiles.length > 0 ? (
                <ul className="evidence-file-list">
                  {reportCardEvidenceFiles.map((file) => (
                    <li key={`${file.name}-${file.size}`}>{file.name}</li>
                  ))}
                </ul>
              ) : (
                <div className="evidence-empty">
                  Chưa chọn ảnh minh chứng học bạ.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {selectedMethodId === "thptExam" ? (
        <div className="section-card">
          <div className="card-body">
            <SectionTitle
              number="4"
              title="Dữ liệu điểm thi THPT"
              hint="Chỉ hiện khi chọn xét điểm thi THPT."
            />

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label">Học lực lớp 12</label>
                <select
                  className="form-select"
                  value={form.thptExam.academicPerformance12}
                  onChange={(event) =>
                    setThptField("academicPerformance12", event.target.value)
                  }
                >
                  {ACADEMIC_PERFORMANCE_OPTIONS.map((item) => (
                    <option
                      key={item.value || "empty-academic-12"}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Hạnh kiểm lớp 12</label>
                <select
                  className="form-select"
                  value={form.thptExam.conduct12}
                  onChange={(event) =>
                    setThptField("conduct12", event.target.value)
                  }
                >
                  {CONDUCT_GRADE_OPTIONS.map((item) => (
                    <option
                      key={item.value || "empty-conduct-12"}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Điểm TB lớp 12</label>
                <input
                  className="form-control"
                  value={form.thptExam.average12}
                  onChange={(event) =>
                    setThptField("average12", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              {THPT_SUBJECTS.map((subject) => (
                <div className="col-lg-4 col-md-6" key={subject.code}>
                  <label className="form-label">{subject.label}</label>
                  <input
                    className="form-control"
                    value={form.thptExam.subjects[subject.code] || ""}
                    onChange={(event) =>
                      setThptSubject(subject.code, event.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <div className="subsection-card">
              <div className="subsection-title">Chứng chỉ / điểm bổ sung</div>
              <div className="row g-3">
                {CERTIFICATE_FIELDS.map((field) => (
                  <div
                    className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
                    key={field.code}
                  >
                    <label className="form-label">{field.label}</label>
                    <input
                      className="form-control"
                      value={form.thptExam.certificates[field.code] || ""}
                      onChange={(event) =>
                        setThptCertificate(field.code, event.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedMethodId === "gdnl" ? (
        <div className="section-card">
          <div className="card-body">
            <SectionTitle
              number="4"
              title="Dữ liệu ĐGNL"
              hint="Nhập theo từng đợt thi ĐGNL."
            />

            <ArrayInputTable
              rows={form.gdnl}
              columns={gdnlColumns}
              onChange={setGdnlField}
              onAdd={addGdnl}
              onRemove={removeGdnl}
            />
          </div>
        </div>
      ) : null}

      {selectedMethodId === "vsat" ? (
        <div className="section-card">
          <div className="card-body">
            <SectionTitle
              number="4"
              title="Dữ liệu V-SAT"
              hint="Nhập đúng theo mẫu V-SAT."
            />

            <ArrayInputTable
              rows={form.vsat}
              columns={vsatColumns}
              onChange={setVsatField}
              onAdd={addVsat}
              onRemove={removeVsat}
            />
          </div>
        </div>
      ) : null}

      <div className="sticky-submit-bar">
        <button
          type="submit"
          className="btn btn-primary px-4"
          disabled={submitting}
        >
          {submitting ? "Đang lưu..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

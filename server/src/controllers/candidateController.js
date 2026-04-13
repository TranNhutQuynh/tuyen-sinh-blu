const pool = require("../config/db");
const { created, fail } = require("../utils/response");

const generateApplicationCode = () => `TS${Date.now()}`;

const parsePayload = (req) => {
  if (req.body?.application) {
    return JSON.parse(req.body.application);
  }
  return req.body || {};
};

const isBlank = (value) => String(value ?? "").trim() === "";

const isValidNumber = (value) => {
  if (value === null || value === undefined || value === "") return false;
  return !Number.isNaN(Number(String(value).replace(",", ".")));
};

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

const validateCandidateBaseInfo = ({
  fullName,
  nationalId,
  birthDate,
  gender,
  phone,
  email,
  graduationYear,
  examNumber,
  schoolCode,
  priorityAreaCode,
  priorityObjectCode,
  personalInfo,
}) => {
  if (isBlank(fullName)) {
    return "Thiếu họ tên";
  }

  if (!isValidNationalId(nationalId)) {
    return "CCCD/ĐDCN không hợp lệ";
  }

  if (isBlank(birthDate)) {
    return "Thiếu ngày sinh";
  }

  if (isBlank(gender)) {
    return "Thiếu giới tính";
  }

  if (!isValidPhone(phone)) {
    return "Số điện thoại không hợp lệ";
  }

  if (!isValidEmail(email)) {
    return "Email không hợp lệ";
  }

  if (!isValidGraduationYear(graduationYear)) {
    return "Năm tốt nghiệp không hợp lệ";
  }

  if (!isValidExamNumber(examNumber)) {
    return "Số báo danh THPT không hợp lệ";
  }

  if (isBlank(schoolCode)) {
    return "Thiếu trường THPT";
  }

  if (isBlank(priorityAreaCode)) {
    return "Thiếu khu vực ưu tiên";
  }

  if (isBlank(priorityObjectCode)) {
    return "Thiếu đối tượng ưu tiên";
  }

  if (isBlank(personalInfo?.address)) {
    return "Thiếu địa chỉ";
  }

  return "";
};

const validatePreferences = (preferences = []) => {
  if (!Array.isArray(preferences) || preferences.length === 0) {
    return "Vui lòng nhập ít nhất 1 nguyện vọng";
  }

  for (let i = 0; i < preferences.length; i += 1) {
    const item = preferences[i];

    if (isBlank(item.priorityOrder)) {
      return `Nguyện vọng ${i + 1}: thiếu thứ tự nguyện vọng`;
    }

    if (isBlank(item.majorCode)) {
      return `Nguyện vọng ${i + 1}: chưa chọn ngành`;
    }

    if (isBlank(item.majorName)) {
      return `Nguyện vọng ${i + 1}: thiếu tên ngành`;
    }

    if (isBlank(item.subjectCombinationCode)) {
      return `Nguyện vọng ${i + 1}: chưa chọn tổ hợp`;
    }

    if (isBlank(item.admissionMethodCode) || isBlank(item.admissionMethodName)) {
      return `Nguyện vọng ${i + 1}: thiếu phương thức xét tuyển`;
    }
  }

  return "";
};

const validateThptExamData = (thptExam = {}) => {
  if (isBlank(thptExam.academicPerformance12)) {
    return "Thiếu học lực lớp 12";
  }

  if (isBlank(thptExam.conduct12)) {
    return "Thiếu hạnh kiểm lớp 12";
  }

  if (!isValidNumber(thptExam.average12)) {
    return "Điểm trung bình lớp 12 không hợp lệ";
  }

  const subjectValues = Object.values(thptExam.subjects || {});
  const hasAtLeastOneScore = subjectValues.some(
    (value) => !isBlank(value) && isValidNumber(value)
  );

  if (!hasAtLeastOneScore) {
    return "Thiếu dữ liệu điểm thi THPT";
  }

  return "";
};

const validateReportCardData = (reportCard = {}, uploadedFiles = []) => {
  const scores = reportCard.scores || {};
  const rows = Object.values(scores);

  if (!rows.length) {
    return "Thiếu dữ liệu học bạ";
  }

  const hasCompleteSubject = rows.some((row) => {
    return (
      !isBlank(row?.["10_HK1"]) &&
      !isBlank(row?.["10_HK2"]) &&
      !isBlank(row?.["11_HK1"]) &&
      !isBlank(row?.["11_HK2"]) &&
      !isBlank(row?.["12_HK1"]) &&
      !isBlank(row?.["12_HK2"]) &&
      isValidNumber(row?.["10_HK1"]) &&
      isValidNumber(row?.["10_HK2"]) &&
      isValidNumber(row?.["11_HK1"]) &&
      isValidNumber(row?.["11_HK2"]) &&
      isValidNumber(row?.["12_HK1"]) &&
      isValidNumber(row?.["12_HK2"])
    );
  });

  if (!hasCompleteSubject) {
    return "Vui lòng nhập đầy đủ điểm 6 học kì cho ít nhất 1 môn học bạ";
  }

  if (
    isBlank(reportCard.academic10Year) ||
    isBlank(reportCard.academic11Year) ||
    isBlank(reportCard.academic12Year)
  ) {
    return "Thiếu học lực cả năm lớp 10, 11 hoặc 12";
  }

  if (
    isBlank(reportCard.conduct10Year) ||
    isBlank(reportCard.conduct11Year) ||
    isBlank(reportCard.conduct12Year)
  ) {
    return "Thiếu hạnh kiểm cả năm lớp 10, 11 hoặc 12";
  }

  if (!Array.isArray(uploadedFiles) || uploadedFiles.length === 0) {
    return "Nếu chọn xét học bạ thì bắt buộc phải tải ảnh minh chứng học bạ";
  }

  return "";
};

const validateGdnlData = (gdnl = []) => {
  if (!Array.isArray(gdnl) || gdnl.length === 0) {
    return "Thiếu dữ liệu ĐGNL";
  }

  for (let i = 0; i < gdnl.length; i += 1) {
    const row = gdnl[i];

    if (
      isBlank(row.organizerName) ||
      isBlank(row.examRound) ||
      isBlank(row.examDate) ||
      isBlank(row.subjectName) ||
      !isValidNumber(row.scoreScale) ||
      !isValidNumber(row.score)
    ) {
      return `Dòng ĐGNL ${i + 1} chưa đầy đủ`;
    }
  }

  return "";
};

const validateVsatData = (vsat = []) => {
  if (!Array.isArray(vsat) || vsat.length === 0) {
    return "Thiếu dữ liệu V-SAT";
  }

  for (let i = 0; i < vsat.length; i += 1) {
    const row = vsat[i];

    if (
      isBlank(row.organizerName) ||
      isBlank(row.examRound) ||
      isBlank(row.examDate) ||
      isBlank(row.subjectCode) ||
      !isValidNumber(row.scoreScale) ||
      !isValidNumber(row.score)
    ) {
      return `Dòng V-SAT ${i + 1} chưa đầy đủ`;
    }
  }

  return "";
};

const validateMethodData = ({
  selectedAdmissionMethod,
  thptExam,
  reportCard,
  gdnl,
  vsat,
  uploadedFiles,
}) => {
  if (selectedAdmissionMethod === "thptExam") {
    return validateThptExamData(thptExam);
  }

  if (selectedAdmissionMethod === "reportCard") {
    return validateReportCardData(reportCard, uploadedFiles);
  }

  if (selectedAdmissionMethod === "gdnl") {
    return validateGdnlData(gdnl);
  }

  if (selectedAdmissionMethod === "vsat") {
    return validateVsatData(vsat);
  }

  return "Chưa chọn phương thức xét tuyển hợp lệ";
};

const createCandidate = async (req, res) => {
  let connection;

  try {
    const payload = parsePayload(req);

    const {
      applicationCode,
      fullName,
      nationalId,
      birthDate,
      gender,
      phone,
      email,
      graduationYear,
      examNumber,
      ethnicCode,
      ethnicName,
      priorityObjectCode,
      priorityAreaCode,
      schoolCode,
      schoolName,
      birthPlace,
      provinceCode,
      districtCode,
      wardCode,
      personalInfo = {},
      preferences = [],
      thptExam = {},
      reportCard = {},
      gdnl = [],
      vsat = [],
    } = payload;

    const normalizedFullName = String(fullName || "").trim();
    const normalizedNationalId = String(nationalId || "").trim();
    const selectedAdmissionMethod = personalInfo?.selectedAdmissionMethod || "";

    const uploadedFiles = (req.files || []).map((file) => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
    }));

    const baseInfoError = validateCandidateBaseInfo({
      fullName: normalizedFullName,
      nationalId: normalizedNationalId,
      birthDate,
      gender,
      phone,
      email,
      graduationYear,
      examNumber,
      schoolCode,
      priorityAreaCode,
      priorityObjectCode,
      personalInfo,
    });

    if (baseInfoError) {
      return fail(res, 400, baseInfoError);
    }

    const preferenceError = validatePreferences(preferences);
    if (preferenceError) {
      return fail(res, 400, preferenceError);
    }

    const methodError = validateMethodData({
      selectedAdmissionMethod,
      thptExam,
      reportCard,
      gdnl,
      vsat,
      uploadedFiles,
    });

    if (methodError) {
      return fail(res, 400, methodError);
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    let currentPeriod = null;

    try {
      const [periodRows] = await connection.query(
        `
        SELECT id, period_name
        FROM registration_periods
        WHERE is_active = 1
          AND NOW() BETWEEN start_at AND end_at
        ORDER BY start_at ASC
        LIMIT 1
        `
      );

      if (periodRows.length) {
        currentPeriod = periodRows[0];
      }
    } catch (periodError) {
      console.error("registration period check error:", periodError);
    }

    const finalReportCard = {
      ...reportCard,
      evidenceFiles: uploadedFiles,
    };

    const finalApplicationCode = applicationCode || generateApplicationCode();

    const [result] = await connection.query(
      `
      INSERT INTO candidates (
        application_code,
        registration_period_id,
        registration_period_name,
        full_name,
        national_id,
        birth_date,
        gender,
        phone,
        email,
        graduation_year,
        exam_number,
        ethnic_code,
        ethnic_name,
        priority_object_code,
        priority_area_code,
        school_code,
        school_name,
        birth_place,
        province_code,
        district_code,
        ward_code,
        personal_info_json,
        thpt_exam_json,
        report_card_json,
        gdnl_json,
        vsat_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        finalApplicationCode,
        currentPeriod?.id || null,
        currentPeriod?.period_name || null,
        normalizedFullName,
        normalizedNationalId,
        birthDate || null,
        gender || null,
        phone || null,
        email || null,
        graduationYear || null,
        examNumber || null,
        ethnicCode || null,
        ethnicName || null,
        priorityObjectCode || null,
        priorityAreaCode || null,
        schoolCode || null,
        schoolName || null,
        birthPlace || null,
        provinceCode || null,
        districtCode || null,
        wardCode || null,
        JSON.stringify(personalInfo || {}),
        JSON.stringify(thptExam || {}),
        JSON.stringify(finalReportCard || {}),
        JSON.stringify(Array.isArray(gdnl) ? gdnl : []),
        JSON.stringify(Array.isArray(vsat) ? vsat : []),
      ]
    );

    const candidateId = result.insertId;

    if (Array.isArray(preferences) && preferences.length) {
      const values = preferences.map((item) => [
        candidateId,
        item.priorityOrder || null,
        item.institutionCode || "DBL",
        item.institutionName || "Trường Đại học Bạc Liêu",
        item.majorCode || null,
        item.majorName || null,
        item.admissionMethodCode || null,
        item.admissionMethodName || null,
        item.methodStandardCode || null,
        item.methodStandardName || null,
        item.admissionTypeCode || null,
        item.subjectCombinationCode || null,
        item.foreignLanguageSubjectCode || null,
        item.foreignLanguageScore || null,
        item.extraSubjectCode || null,
        item.extraSubjectScore || null,
        item.aspirationMonthRank || null,
      ]);

      await connection.query(
        `
        INSERT INTO candidate_preferences (
          candidate_id,
          priority_order,
          institution_code,
          institution_name,
          major_code,
          major_name,
          admission_method_code,
          admission_method_name,
          method_standard_code,
          method_standard_name,
          admission_type_code,
          subject_combination_code,
          foreign_language_subject_code,
          foreign_language_score,
          extra_subject_code,
          extra_subject_score,
          aspiration_month_rank
        ) VALUES ?
        `,
        [values]
      );
    }

    await connection.commit();

    return created(
      res,
      {
        id: candidateId,
        applicationCode: finalApplicationCode,
      },
      "Đã lưu hồ sơ thành công"
    );
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("createCandidate error:", error);
    return fail(res, 500, "Không thể lưu hồ sơ");
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  createCandidate,
};
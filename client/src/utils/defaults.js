export const REPORT_CARD_SUBJECTS = [
  { code: "VA", label: "Ngữ văn" },
  { code: "TO", label: "Toán" },
  { code: "NN", label: "Ngoại ngữ" },
  { code: "LI", label: "Vật lí" },
  { code: "HO", label: "Hóa học" },
  { code: "SI", label: "Sinh học" },
  { code: "SU", label: "Lịch sử" },
  { code: "DI", label: "Địa lí" },
  { code: "KTPL", label: "Giáo dục KT&PL" },
  { code: "CNCN", label: "Công nghệ CN" },
  { code: "CNNN", label: "Công nghệ NN" },
  { code: "TI", label: "Tin học" },
  { code: "GDCD", label: "GD công dân" },
];

export const FOREIGN_LANGUAGE_OPTIONS = [
  { value: "", label: "-- Chọn ngoại ngữ --" },
  { value: "N1", label: "N1" },
  { value: "N2", label: "N2" },
  { value: "N3", label: "N3" },
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
];

export const THPT_SUBJECTS = [
  { code: "CTO", label: "Toán" },
  { code: "CVA", label: "Ngữ văn" },
  { code: "CLI", label: "Vật lí" },
  { code: "CHO", label: "Hóa học" },
  { code: "CSI", label: "Sinh học" },
  { code: "CSU", label: "Lịch sử" },
  { code: "CDI", label: "Địa lí" },
  { code: "CGD", label: "GDCD" },
  { code: "CNN", label: "Ngoại ngữ" },
];

export const CERTIFICATE_FIELDS = Array.from({ length: 6 }, (_, index) => ({
  code: `CNK${index + 1}`,
  label: `Chứng chỉ ${index + 1}`,
}));

export const ADMISSION_METHOD_OPTIONS = [
  {
    id: "thptExam",
    code: "100",
    title: "Xét điểm thi THPT",
    shortTitle: "THPT",
    description: "Nhập điểm các môn thi THPT.",
  },
  {
    id: "reportCard",
    code: "200",
    title: "Xét học bạ",
    shortTitle: "Học bạ",
    description: "Nhập điểm 6 học kì và tải minh chứng học bạ.",
  },
  {
    id: "gdnl",
    code: "402",
    title: "Đánh giá năng lực",
    shortTitle: "ĐGNL",
    description: "Nhập điểm theo các đợt thi ĐGNL.",
  },
  {
    id: "vsat",
    code: "VSAT",
    title: "V-SAT",
    shortTitle: "V-SAT",
    description: "Nhập điểm kỳ thi V-SAT.",
  },
];

export const PRIORITY_AREA_OPTIONS = [
  { code: "", name: "-- Chọn khu vực ưu tiên --" },
  { code: "KV1", name: "KV1" },
  { code: "KV2NT", name: "KV2-NT" },
  { code: "KV2", name: "KV2" },
  { code: "KV3", name: "KV3" },
];

export const PRIORITY_OBJECT_OPTIONS = [
  { code: "", name: "-- Chọn đối tượng ưu tiên --" },
  { code: "00", name: "Không ưu tiên" },
  { code: "01", name: "Đối tượng 01" },
  { code: "02", name: "Đối tượng 02" },
  { code: "03", name: "Đối tượng 03" },
  { code: "04", name: "Đối tượng 04" },
  { code: "05", name: "Đối tượng 05" },
  { code: "06", name: "Đối tượng 06" },
  { code: "07", name: "Đối tượng 07" },
];

export const ACADEMIC_OPTIONS = [
  { value: "", label: "-- Chọn học lực cả năm --" },
  { value: "Xuất sắc", label: "Xuất sắc" },
  { value: "Giỏi", label: "Giỏi" },
  { value: "Khá", label: "Khá" },
  { value: "Đạt", label: "Đạt" },
  { value: "Trung bình", label: "Trung bình" },
  { value: "Yếu", label: "Yếu" },
];

export const CONDUCT_OPTIONS = [
  { value: "", label: "-- Chọn hạnh kiểm cả năm --" },
  { value: "Tốt", label: "Tốt" },
  { value: "Khá", label: "Khá" },
  { value: "Đạt", label: "Đạt" },
  { value: "Trung bình", label: "Trung bình" },
  { value: "Yếu", label: "Yếu" },
];

/*
  Mấy danh mục này nên lấy từ API / database admin import từ file Excel.
  Nếu chưa có API thì tạm dùng fallback mẫu.
*/
export const MAJOR_OPTIONS_FALLBACK = [
  { code: "51140201", name: "Giáo dục Mầm non" },
  { code: "7140202", name: "Giáo dục Tiểu học" },
  { code: "7140209", name: "Sư phạm Toán học" },
  { code: "7140212", name: "Sư phạm Hóa học" },
];

export const SUBJECT_COMBINATION_OPTIONS_FALLBACK = [
  { code: "A00", name: "Toán - Vật lí - Hóa học" },
  { code: "A01", name: "Toán - Vật lí - Tiếng Anh" },
  { code: "B00", name: "Toán - Hóa học - Sinh học" },
  { code: "C00", name: "Ngữ văn - Lịch sử - Địa lí" },
  { code: "D01", name: "Toán - Ngữ văn - Tiếng Anh" },
];

export const SCHOOL_OPTIONS_FALLBACK = [
  { code: "2", name: "THPT Bạc Liêu" },
  { code: "8", name: "THPT Phan Ngọc Hiển" },
  { code: "9999", name: "THPT Điền Hải" },
];

export function getMethodById(methodId) {
  return ADMISSION_METHOD_OPTIONS.find((item) => item.id === methodId) || null;
}

export function mapMethodToPreference(methodId) {
  const method = getMethodById(methodId);

  return {
    admissionMethodId: method?.id || "",
    admissionMethodCode: method?.code || "",
    admissionMethodName: method?.title || "",
  };
}

export function normalizeScore(value) {
  if (value === null || value === undefined || value === "") return "";
  const parsed = Number(String(value).replace(",", "."));
  return Number.isNaN(parsed) ? "" : parsed;
}

export function calculateYearScore(hk1, hk2) {
  const score1 = normalizeScore(hk1);
  const score2 = normalizeScore(hk2);

  if (score1 === "" && score2 === "") return "";
  if (score1 === "" && score2 !== "") return score2.toFixed(2);
  if (score1 !== "" && score2 === "") return score1.toFixed(2);

  return ((score1 + score2 * 2) / 3).toFixed(2);
}

const buildSemesterRow = () => ({
  "10_HK1": "",
  "10_HK2": "",
  "11_HK1": "",
  "11_HK2": "",
  "12_HK1": "",
  "12_HK2": "",
});

const reportCardScores = REPORT_CARD_SUBJECTS.reduce((accumulator, subject) => {
  accumulator[subject.code] = buildSemesterRow();
  return accumulator;
}, {});

export const createEmptyPreference = (
  priorityOrder = 1,
  selectedMethodId = "reportCard"
) => ({
  priorityOrder,
  institutionCode: "DBL",
  institutionName: "Trường Đại học Bạc Liêu",
  majorCode: "",
  majorName: "",
  subjectCombinationCode: "",
  ...mapMethodToPreference(selectedMethodId),
});

export const DEFAULT_APPLICATION = {
  applicationCode: "",
  fullName: "",
  nationalId: "",
  birthDate: "",
  gender: "Nam",
  phone: "",
  email: "",
  graduationYear: "",
  examNumber: "",
  ethnicCode: "",
  ethnicName: "",
  priorityObjectCode: "",
  priorityAreaCode: "",
  schoolCode: "",
  schoolName: "",
  birthPlace: "",
  provinceCode: "",
  districtCode: "",
  wardCode: "",
  personalInfo: {
    address: "",
    className: "",
    educationProgramCode: "",
    selectedAdmissionMethod: "reportCard",
  },
  preferences: [createEmptyPreference(1, "reportCard")],
  thptExam: {
    academicPerformance12: "",
    conduct12: "",
    average12: "",
    ethnicCode: "",
    ethnicName: "",
    birthPlace: "",
    provinceCode: "",
    districtCode: "",
    wardCode: "",
    schoolProvinceCode: "",
    schoolCode12: "",
    initialScreeningResult: "",
    citizenshipGroup: "",
    priorityReview: "",
    subjects: THPT_SUBJECTS.reduce((accumulator, subject) => {
      accumulator[subject.code] = "";
      return accumulator;
    }, {}),
    certificates: CERTIFICATE_FIELDS.reduce((accumulator, field) => {
      accumulator[field.code] = "";
      return accumulator;
    }, {}),
    averageInput12: "",
    createdBy: "",
    createdDate: "",
  },
  reportCard: {
    foreignLanguage10: "",
    foreignLanguage11: "",
    foreignLanguage12: "",
    academic10Year: "",
    conduct10Year: "",
    academic11Year: "",
    conduct11Year: "",
    academic12Year: "",
    conduct12Year: "",
    scores: reportCardScores,
  },
  gdnl: [
    {
      organizerCode: "",
      organizerName: "",
      examRound: "",
      examDate: "",
      subjectCode: "",
      subjectName: "",
      scoreScale: "",
      score: "",
    },
  ],
  vsat: [
    {
      organizerCode: "",
      organizerName: "",
      examRound: "",
      examDate: "",
      subjectCode: "",
      scoreScale: "",
      score: "",
    },
  ],
};

export const ACADEMIC_PERFORMANCE_OPTIONS = [
  { value: "", label: "-- Chọn học lực lớp 12 --" },
  { value: "Xuất sắc", label: "Xuất sắc" },
  { value: "Giỏi", label: "Giỏi" },
  { value: "Khá", label: "Khá" },
  { value: "Đạt", label: "Đạt" },
  { value: "Trung bình", label: "Trung bình" },
  { value: "Yếu", label: "Yếu" },
];

export const CONDUCT_GRADE_OPTIONS = [
  { value: "", label: "-- Chọn hạnh kiểm lớp 12 --" },
  { value: "Tốt", label: "Tốt" },
  { value: "Khá", label: "Khá" },
  { value: "Đạt", label: "Đạt" },
  { value: "Trung bình", label: "Trung bình" },
  { value: "Yếu", label: "Yếu" },
];

export const cloneApplication = (payload) =>
  JSON.parse(JSON.stringify(payload || DEFAULT_APPLICATION));

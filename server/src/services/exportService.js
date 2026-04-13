const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const { mapCandidateRow } = require("../utils/candidateMapper");

const TEMPLATE_DIR = path.join(__dirname, "../templates");
const DATA_START_ROW = 3;

const TEMPLATE_CONFIGS = {
  "nguyen-vong": {
    fileName: "mau_add_dulieu_xulynv_locao_dsnv_dkxt_capnganh.xlsm",
    bookType: "xlsm",
    headers: [
      "STT",
      "CMND",
      "CTHUTUNVCN",
      "MATRUONG",
      "TENTRUONG",
      "MANGANH",
      "TENNGANH",
      "CTTNGANHPT",
      "PHUONGTHUC",
      "TENPT",
      "MAPTCHUAN",
      "TENPTCHUAN",
      "MALOAIPTXT",
      "TOHOPMON",
      "MAMONNN",
      "DIEMNN",
      "MAMONTCP",
      "DIEMNNTCP",
      "NVTTHANG",
    ],
    mimeType: "application/vnd.ms-excel.sheet.macroEnabled.12",
  },
  "diem-thpt": {
    fileName: "mau_add_dulieu_xulynv_locao_dsthisinh_diemthpt.xlsx",
    bookType: "xlsx",
    headers: [
      "STT",
      "SBDTHPT",
      "HOTEN",
      "CMND",
      "NGAYSINH",
      "GIOITINH",
      "DTUT",
      "KVUT",
      "NAMTNTHPT",
      "HOCLUC12",
      "HANHKIEM12",
      "CTB12",
      "TNCD",
      "TNTC",
      "MATINHHK",
      "TENTINHHK",
      "MAQHHK",
      "TENQHHK",
      "MAPXHK",
      "TENPXHK",
      "MATINHL12",
      "MATRUONG12",
      "KQSOTUYEN",
      "CTO",
      "CVA",
      "CLI",
      "CHO",
      "CSI",
      "CSU",
      "CDI",
      "CGD",
      "CNN",
      "MONNN",
      "CKTPL",
      "CTI",
      "CCNCN",
      "CCNNN",
      "CTGDPT",
      "CNK1",
      "CNK2",
      "CNK3",
      "CNK4",
      "CNK5",
      "CNK6",
      "CNK7",
      "CNK8",
      "CNK9",
      "CNK10",
      "CDTBTN12",
      "NGUOITAO",
      "NGAYNHAP",
      "TENDANTOC",
      "MADANTOC",
      "NOISINH",
    ],
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  "hoc-ba": {
    fileName: "mau_add_dulieu_xulynv_locao_hocbathpt.xls",
    bookType: "biff8",
    headers: [
      "CSTT",
      "CMND",
      "HOTEN",
      "NGAYSINH",
      "GIOITINH",
      "CMALOPTHPT",
      "CTGDPT",
      "CDIEMTBNAM",
      "CDIEMTKHK1",
      "CDIEMTKHK2",
      "CDIEMTKCN",
      "HL2006HK1",
      "HL2006HK2",
      "HL2006CN",
      "HK2006HK1",
      "HK2006HK2",
      "HK2006CN",
      "KQHT2018K1",
      "KQHT2018K2",
      "KQHT2018CN",
      "RL2018HK1",
      "RL2018HK2",
      "RL2018CN",
      "CDIEMTOHK1",
      "CDIEMTOHK2",
      "CDIEMTOCN",
      "CDIEMVAHK1",
      "CDIEMVAHK2",
      "CDIEMVACN",
      "CDIEMLIHK1",
      "CDIEMLIHK2",
      "CDIEMLICN",
      "CDIEMHOHK1",
      "CIEMHOHK2",
      "CDIEMHOCN",
      "CDIEMSIHK1",
      "CDIEMSIHK2",
      "CDIEMSICN",
      "CDIEMSUHK1",
      "CDIEMSUHK2",
      "CDIEMSUCN",
      "CDIEMDIHK1",
      "CDIEMDIHK2",
      "CDIEMDICN",
      "CDIEMGDHK1",
      "CDIEMGDHK2",
      "CDIEMGDCN",
      "CDKTPLHK1",
      "CDKTPLHK2",
      "CDKTPLCN",
      "CDIEMTIHK1",
      "CDIEMTIHK2",
      "CDIEMTICN",
      "CDCNCNHK1",
      "CDCNCNHK2",
      "CDCNCNCN",
      "CDCNNNHK1",
      "CDCNNNHK2",
      "CDCNNNCN",
      "CDIEMNNHK1",
      "CDIEMNNHK2",
      "CDIEMNNCN",
      "MONNN",
      "CDIEMSNHK1",
      "CDIEMSNHK2",
      "CDIEMSNCN",
      "CDIEMQPHK1",
      "CDIEMQPHK2",
      "CDIEMQPCN",
      "CDIEMDTHK1",
      "CDIEMDTHK2",
      "CDIEMDTCN",
      "CDIEMNN2K1",
      "CDIEMNN2K2",
      "CDIEMNNCN",
      "CDIEMTPHK1",
      "CDIEMTPHK2",
      "CDIEMTPCN",
    ],
    mimeType: "application/vnd.ms-excel",
  },
  gdnl: {
    fileName: "mau_add_dulieu_xulynv_locao_nhapdiem_gdnl_nhieudotthi.xls",
    bookType: "biff8",
    headers: [
      "STT",
      "MADONVI",
      "TENDONVI",
      "CMND",
      "HOTEN",
      "NGAYSINH",
      "GIOITINH",
      "DOTTHI",
      "NGAYTHI",
      "MAMONDGNL",
      "TENMONDGNL",
      "CTHANGDIEM",
      "CDIEMDGNL",
    ],
    mimeType: "application/vnd.ms-excel",
  },
  vsat: {
    fileName: "mau_add_dulieu_xulynv_locao_nhapdiem_vsat_motcotdiem.xls",
    bookType: "biff8",
    headers: [
      "STT",
      "MADONVI",
      "TENDONVI",
      "CMND",
      "HOTEN",
      "NGAYSINH",
      "GIOITINH",
      "DOTTHI",
      "NGAYTHI",
      "MAMONVS",
      "CTHANGDIEM",
      "CDIEMVS",
    ],
    mimeType: "application/vnd.ms-excel",
  },
};

const safe = (value) => (value === undefined || value === null ? "" : value);

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const normalizeNumber = (value) => {
  if (value === undefined || value === null || value === "") return "";
  const parsed = Number(String(value).replace(",", "."));
  return Number.isNaN(parsed) ? "" : parsed;
};

const calculateYearScore = (hk1, hk2) => {
  const score1 = normalizeNumber(hk1);
  const score2 = normalizeNumber(hk2);

  if (score1 === "" && score2 === "") return "";
  if (score1 === "" && score2 !== "") return score2;
  if (score1 !== "" && score2 === "") return score1;

  return Number(((score1 + score2 * 2) / 3).toFixed(2));
};

const getPreferencesByCandidate = (candidateId, preferenceRows) =>
  preferenceRows.filter((item) => Number(item.candidate_id) === Number(candidateId));

const getTemplatePath = (fileName) => path.join(TEMPLATE_DIR, fileName);

const readTemplateWorkbook = (fileName) => {
  const templatePath = getTemplatePath(fileName);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Không tìm thấy file mẫu: ${fileName}`);
  }

  return XLSX.readFile(templatePath, {
    cellStyles: true,
    bookVBA: true,
  });
};

const getFirstSheet = (workbook) => {
  const firstSheetName = workbook.SheetNames[0];
  return {
    sheetName: firstSheetName,
    worksheet: workbook.Sheets[firstSheetName],
  };
};

const setCellValue = (worksheet, rowIndex, colIndex, value) => {
  const address = XLSX.utils.encode_cell({ r: rowIndex - 1, c: colIndex - 1 });

  if (!worksheet[address]) {
    worksheet[address] = {};
  }

  if (typeof value === "number") {
    worksheet[address].t = "n";
    worksheet[address].v = value;
  } else {
    worksheet[address].t = "s";
    worksheet[address].v = safe(value);
  }
};

const clearOldTemplateData = (worksheet, headers, fromRow = DATA_START_ROW, toRow = 2000) => {
  for (let r = fromRow; r <= toRow; r += 1) {
    for (let c = 1; c <= headers.length; c += 1) {
      const address = XLSX.utils.encode_cell({ r: r - 1, c: c - 1 });
      if (worksheet[address]) {
        worksheet[address].v = "";
        worksheet[address].w = "";
        worksheet[address].t = "s";
      }
    }
  }
};

const fillTemplateRows = (worksheet, headers, rows) => {
  rows.forEach((rowData, index) => {
    const rowNumber = DATA_START_ROW + index;

    headers.forEach((header, colIndex) => {
      setCellValue(worksheet, rowNumber, colIndex + 1, rowData[header]);
    });
  });

  const endRow = Math.max(DATA_START_ROW + rows.length - 1, DATA_START_ROW);
  worksheet["!ref"] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: endRow - 1, c: headers.length - 1 },
  });
};

const scoreBySemester = (scores, subjectCode, semesterKey) =>
  safe(scores?.[subjectCode]?.[semesterKey]);

const mapThptRows = (candidateRows) =>
  candidateRows.map((row, index) => {
    const candidate = mapCandidateRow(row);
    const thpt = candidate.thptExam || {};
    const subjects = thpt.subjects || {};
    const certificates = thpt.certificates || {};

    return {
      STT: index + 1,
      SBDTHPT: candidate.examNumber,
      HOTEN: candidate.fullName,
      CMND: candidate.nationalId,
      NGAYSINH: formatDate(candidate.birthDate),
      GIOITINH: candidate.gender,
      DTUT: candidate.priorityObjectCode,
      KVUT: candidate.priorityAreaCode,
      NAMTNTHPT: candidate.graduationYear,
      HOCLUC12: thpt.academicPerformance12,
      HANHKIEM12: thpt.conduct12,
      CTB12: thpt.average12,
      TNCD: thpt.citizenshipGroup,
      TNTC: thpt.priorityReview,
      MATINHHK: candidate.provinceCode,
      TENTINHHK: thpt.provinceName,
      MAQHHK: candidate.districtCode,
      TENQHHK: thpt.districtName,
      MAPXHK: candidate.wardCode,
      TENPXHK: thpt.wardName,
      MATINHL12: thpt.schoolProvinceCode,
      MATRUONG12: thpt.schoolCode12 || candidate.schoolCode,
      KQSOTUYEN: thpt.initialScreeningResult,
      CTO: subjects.CTO,
      CVA: subjects.CVA,
      CLI: subjects.CLI,
      CHO: subjects.CHO,
      CSI: subjects.CSI,
      CSU: subjects.CSU,
      CDI: subjects.CDI,
      CGD: subjects.CGD,
      CNN: subjects.CNN,
      MONNN: thpt.foreignLanguageSubjectCode,
      CKTPL: subjects.CKTPL,
      CTI: subjects.CTI,
      CCNCN: subjects.CCNCN,
      CCNNN: subjects.CCNNN,
      CTGDPT: candidate.personalInfo?.educationProgramCode || thpt.educationProgramCode,
      CNK1: certificates.CNK1,
      CNK2: certificates.CNK2,
      CNK3: certificates.CNK3,
      CNK4: certificates.CNK4,
      CNK5: certificates.CNK5,
      CNK6: certificates.CNK6,
      CNK7: certificates.CNK7,
      CNK8: certificates.CNK8,
      CNK9: certificates.CNK9,
      CNK10: certificates.CNK10,
      CDTBTN12: thpt.averageInput12,
      NGUOITAO: thpt.createdBy,
      NGAYNHAP: thpt.createdDate,
      TENDANTOC: candidate.ethnicName,
      MADANTOC: candidate.ethnicCode,
      NOISINH: candidate.birthPlace,
    };
  });

const mapPreferenceRows = (candidateRows, preferenceRows) => {
  const results = [];
  let serial = 1;

  candidateRows.forEach((candidateRow) => {
    const candidate = mapCandidateRow(candidateRow);
    const preferences = getPreferencesByCandidate(candidate.id, preferenceRows);

    preferences.forEach((preference) => {
      results.push({
        STT: serial++,
        CMND: candidate.nationalId,
        CTHUTUNVCN: preference.priority_order,
        MATRUONG: preference.institution_code || "DBL",
        TENTRUONG: preference.institution_name || "Trường Đại học Bạc Liêu",
        MANGANH: preference.major_code,
        TENNGANH: preference.major_name,
        CTTNGANHPT: preference.priority_order,
        PHUONGTHUC: preference.admission_method_code,
        TENPT: preference.admission_method_name,
        MAPTCHUAN: preference.method_standard_code,
        TENPTCHUAN: preference.method_standard_name,
        MALOAIPTXT: preference.admission_type_code,
        TOHOPMON: preference.subject_combination_code,
        MAMONNN: preference.foreign_language_subject_code,
        DIEMNN: preference.foreign_language_score,
        MAMONTCP: preference.extra_subject_code,
        DIEMNNTCP: preference.extra_subject_score,
        NVTTHANG: preference.aspiration_month_rank,
      });
    });
  });

  return results;
};

const mapHocBaRows = (candidateRows) =>
  candidateRows.map((row, index) => {
    const candidate = mapCandidateRow(row);
    const reportCard = candidate.reportCard || {};
    const scores = reportCard.scores || {};

    const y10 = {
      academic: reportCard.academic10Year,
      conduct: reportCard.conduct10Year,
    };
    const y11 = {
      academic: reportCard.academic11Year,
      conduct: reportCard.conduct11Year,
    };
    const y12 = {
      academic: reportCard.academic12Year,
      conduct: reportCard.conduct12Year,
    };

    return {
      CSTT: index + 1,
      CMND: candidate.nationalId,
      HOTEN: candidate.fullName,
      NGAYSINH: formatDate(candidate.birthDate),
      GIOITINH: candidate.gender,
      CMALOPTHPT: candidate.personalInfo?.className || reportCard.classCode,
      CTGDPT: candidate.personalInfo?.educationProgramCode || reportCard.educationProgramCode,
      CDIEMTBNAM: reportCard.yearlyAverage,
      CDIEMTKHK1: reportCard.termAverageHK1,
      CDIEMTKHK2: reportCard.termAverageHK2,
      CDIEMTKCN: reportCard.termAverageYear,

      HL2006HK1: "",
      HL2006HK2: "",
      HL2006CN: y10.academic,
      HK2006HK1: "",
      HK2006HK2: "",
      HK2006CN: y10.conduct,

      KQHT2018K1: "",
      KQHT2018K2: "",
      KQHT2018CN: y11.academic,
      RL2018HK1: "",
      RL2018HK2: "",
      RL2018CN: y11.conduct,

      CDIEMTOHK1: scoreBySemester(scores, "TO", "12_HK1"),
      CDIEMTOHK2: scoreBySemester(scores, "TO", "12_HK2"),
      CDIEMTOCN: calculateYearScore(
        scoreBySemester(scores, "TO", "12_HK1"),
        scoreBySemester(scores, "TO", "12_HK2")
      ),

      CDIEMVAHK1: scoreBySemester(scores, "VA", "12_HK1"),
      CDIEMVAHK2: scoreBySemester(scores, "VA", "12_HK2"),
      CDIEMVACN: calculateYearScore(
        scoreBySemester(scores, "VA", "12_HK1"),
        scoreBySemester(scores, "VA", "12_HK2")
      ),

      CDIEMLIHK1: scoreBySemester(scores, "LI", "12_HK1"),
      CDIEMLIHK2: scoreBySemester(scores, "LI", "12_HK2"),
      CDIEMLICN: calculateYearScore(
        scoreBySemester(scores, "LI", "12_HK1"),
        scoreBySemester(scores, "LI", "12_HK2")
      ),

      CDIEMHOHK1: scoreBySemester(scores, "HO", "12_HK1"),
      CIEMHOHK2: scoreBySemester(scores, "HO", "12_HK2"),
      CDIEMHOCN: calculateYearScore(
        scoreBySemester(scores, "HO", "12_HK1"),
        scoreBySemester(scores, "HO", "12_HK2")
      ),

      CDIEMSIHK1: scoreBySemester(scores, "SI", "12_HK1"),
      CDIEMSIHK2: scoreBySemester(scores, "SI", "12_HK2"),
      CDIEMSICN: calculateYearScore(
        scoreBySemester(scores, "SI", "12_HK1"),
        scoreBySemester(scores, "SI", "12_HK2")
      ),

      CDIEMSUHK1: scoreBySemester(scores, "SU", "12_HK1"),
      CDIEMSUHK2: scoreBySemester(scores, "SU", "12_HK2"),
      CDIEMSUCN: calculateYearScore(
        scoreBySemester(scores, "SU", "12_HK1"),
        scoreBySemester(scores, "SU", "12_HK2")
      ),

      CDIEMDIHK1: scoreBySemester(scores, "DI", "12_HK1"),
      CDIEMDIHK2: scoreBySemester(scores, "DI", "12_HK2"),
      CDIEMDICN: calculateYearScore(
        scoreBySemester(scores, "DI", "12_HK1"),
        scoreBySemester(scores, "DI", "12_HK2")
      ),

      CDIEMGDHK1: scoreBySemester(scores, "GDCD", "12_HK1"),
      CDIEMGDHK2: scoreBySemester(scores, "GDCD", "12_HK2"),
      CDIEMGDCN: calculateYearScore(
        scoreBySemester(scores, "GDCD", "12_HK1"),
        scoreBySemester(scores, "GDCD", "12_HK2")
      ),

      CDKTPLHK1: scoreBySemester(scores, "KTPL", "12_HK1"),
      CDKTPLHK2: scoreBySemester(scores, "KTPL", "12_HK2"),
      CDKTPLCN: calculateYearScore(
        scoreBySemester(scores, "KTPL", "12_HK1"),
        scoreBySemester(scores, "KTPL", "12_HK2")
      ),

      CDIEMTIHK1: scoreBySemester(scores, "TI", "12_HK1"),
      CDIEMTIHK2: scoreBySemester(scores, "TI", "12_HK2"),
      CDIEMTICN: calculateYearScore(
        scoreBySemester(scores, "TI", "12_HK1"),
        scoreBySemester(scores, "TI", "12_HK2")
      ),

      CDCNCNHK1: scoreBySemester(scores, "CNCN", "12_HK1"),
      CDCNCNHK2: scoreBySemester(scores, "CNCN", "12_HK2"),
      CDCNCNCN: calculateYearScore(
        scoreBySemester(scores, "CNCN", "12_HK1"),
        scoreBySemester(scores, "CNCN", "12_HK2")
      ),

      CDCNNNHK1: scoreBySemester(scores, "CNNN", "12_HK1"),
      CDCNNNHK2: scoreBySemester(scores, "CNNN", "12_HK2"),
      CDCNNNCN: calculateYearScore(
        scoreBySemester(scores, "CNNN", "12_HK1"),
        scoreBySemester(scores, "CNNN", "12_HK2")
      ),

      CDIEMNNHK1: scoreBySemester(scores, "NN", "12_HK1"),
      CDIEMNNHK2: scoreBySemester(scores, "NN", "12_HK2"),
      CDIEMNNCN: calculateYearScore(
        scoreBySemester(scores, "NN", "12_HK1"),
        scoreBySemester(scores, "NN", "12_HK2")
      ),

      MONNN: reportCard.foreignLanguage12 || reportCard.foreignLanguage || "",

      CDIEMSNHK1: "",
      CDIEMSNHK2: "",
      CDIEMSNCN: "",
      CDIEMQPHK1: "",
      CDIEMQPHK2: "",
      CDIEMQPCN: "",
      CDIEMDTHK1: "",
      CDIEMDTHK2: "",
      CDIEMDTCN: "",
      CDIEMNN2K1: "",
      CDIEMNN2K2: "",
      CDIEMNNCN: "",
      CDIEMTPHK1: "",
      CDIEMTPHK2: "",
      CDIEMTPCN: "",
    };
  });

const mapGdnlRows = (candidateRows) => {
  const results = [];
  let serial = 1;

  candidateRows.forEach((row) => {
    const candidate = mapCandidateRow(row);
    const entries = Array.isArray(candidate.gdnl) ? candidate.gdnl : [];

    entries.forEach((entry) => {
      results.push({
        STT: serial++,
        MADONVI: entry.organizerCode,
        TENDONVI: entry.organizerName,
        CMND: candidate.nationalId,
        HOTEN: candidate.fullName,
        NGAYSINH: formatDate(candidate.birthDate),
        GIOITINH: candidate.gender,
        DOTTHI: entry.examRound,
        NGAYTHI: formatDate(entry.examDate),
        MAMONDGNL: entry.subjectCode,
        TENMONDGNL: entry.subjectName,
        CTHANGDIEM: entry.scoreScale,
        CDIEMDGNL: entry.score,
      });
    });
  });

  return results;
};

const mapVsatRows = (candidateRows) => {
  const results = [];
  let serial = 1;

  candidateRows.forEach((row) => {
    const candidate = mapCandidateRow(row);
    const entries = Array.isArray(candidate.vsat) ? candidate.vsat : [];

    entries.forEach((entry) => {
      results.push({
        STT: serial++,
        MADONVI: entry.organizerCode,
        TENDONVI: entry.organizerName,
        CMND: candidate.nationalId,
        HOTEN: candidate.fullName,
        NGAYSINH: formatDate(candidate.birthDate),
        GIOITINH: candidate.gender,
        DOTTHI: entry.examRound,
        NGAYTHI: formatDate(entry.examDate),
        MAMONVS: entry.subjectCode,
        CTHANGDIEM: entry.scoreScale,
        CDIEMVS: entry.score,
      });
    });
  });

  return results;
};

const buildRows = (type, candidateRows, preferenceRows) => {
  switch (type) {
    case "nguyen-vong":
      return mapPreferenceRows(candidateRows, preferenceRows);
    case "diem-thpt":
      return mapThptRows(candidateRows);
    case "hoc-ba":
      return mapHocBaRows(candidateRows);
    case "gdnl":
      return mapGdnlRows(candidateRows);
    case "vsat":
      return mapVsatRows(candidateRows);
    default:
      return null;
  }
};

const buildExportWorkbook = (type, candidateRows, preferenceRows) => {
  const config = TEMPLATE_CONFIGS[type];
  if (!config) return null;

  const rows = buildRows(type, candidateRows, preferenceRows);
  if (rows === null) return null;

  const workbook = readTemplateWorkbook(config.fileName);
  const { worksheet } = getFirstSheet(workbook);

  clearOldTemplateData(worksheet, config.headers, DATA_START_ROW, 2000);
  fillTemplateRows(worksheet, config.headers, rows);

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: config.bookType,
    bookVBA: config.bookType === "xlsm",
  });

  return {
    fileName: config.fileName,
    mimeType: config.mimeType,
    buffer,
  };
};

module.exports = {
  buildExportWorkbook,
};
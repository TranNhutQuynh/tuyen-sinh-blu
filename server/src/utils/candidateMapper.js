const parseJson = (value, fallback) => {
  if (!value) return fallback;

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const mapCandidateRow = (row) => ({
  id: row.id,
  applicationCode: row.application_code,
  fullName: row.full_name,
  nationalId: row.national_id,
  birthDate: row.birth_date,
  gender: row.gender,
  phone: row.phone,
  email: row.email,
  graduationYear: row.graduation_year,
  examNumber: row.exam_number,
  ethnicCode: row.ethnic_code,
  ethnicName: row.ethnic_name,
  priorityObjectCode: row.priority_object_code,
  priorityAreaCode: row.priority_area_code,
  schoolCode: row.school_code,
  schoolName: row.school_name,
  birthPlace: row.birth_place,
  provinceCode: row.province_code,
  districtCode: row.district_code,
  wardCode: row.ward_code,
  personalInfo: parseJson(row.personal_info_json, {}),
  thptExam: parseJson(row.thpt_exam_json, {}),
  reportCard: parseJson(row.report_card_json, {}),
  gdnl: parseJson(row.gdnl_json, []),
  vsat: parseJson(row.vsat_json, []),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

module.exports = {
  parseJson,
  mapCandidateRow,
};

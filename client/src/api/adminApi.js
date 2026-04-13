import http from "./http";

const ADMIN_TOKEN_KEY = "admin_token";

export const loginAdmin = async (payload) => {
  const response = await http.post("/auth/login", payload);
  return response.data;
};

export const getCandidates = async () => {
  const response = await http.get("/admin/candidates");
  return response.data;
};

export const getCandidateDetail = async (id) => {
  const response = await http.get(`/admin/candidates/${id}`);
  return response.data;
};

export const updateCandidate = async (id, payload) => {
  const response = await http.put(`/admin/candidates/${id}`, payload);
  return response.data;
};

export const deleteCandidate = async (id) => {
  const response = await http.delete(`/admin/candidates/${id}`);
  return response.data;
};

export const buildExportUrl = (type) => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  return `${baseUrl}/admin/export/${type}?token=${encodeURIComponent(
    token || ""
  )}`;
};

export const getAdminCatalogSummary = async () => {
  const response = await http.get("/dictionaries/admin/catalogs/summary");
  return response.data;
};

/* Trường THPT */
export const createHighSchool = async (payload) => {
  const response = await http.post("/dictionaries/admin/high-schools", payload);
  return response.data;
};

export const updateHighSchool = async (id, payload) => {
  const response = await http.put(
    `/dictionaries/admin/high-schools/${id}`,
    payload
  );
  return response.data;
};

export const deleteHighSchool = async (id) => {
  const response = await http.delete(`/dictionaries/admin/high-schools/${id}`);
  return response.data;
};

/* Ngành tuyển sinh */
export const createMajor = async (payload) => {
  const response = await http.post("/dictionaries/admin/majors", payload);
  return response.data;
};

export const updateMajor = async (id, payload) => {
  const response = await http.put(`/dictionaries/admin/majors/${id}`, payload);
  return response.data;
};

export const deleteMajor = async (id) => {
  const response = await http.delete(`/dictionaries/admin/majors/${id}`);
  return response.data;
};

/* Tổ hợp môn */
export const createSubjectCombination = async (payload) => {
  const response = await http.post(
    "/dictionaries/admin/subject-combinations",
    payload
  );
  return response.data;
};

export const updateSubjectCombination = async (id, payload) => {
  const response = await http.put(
    `/dictionaries/admin/subject-combinations/${id}`,
    payload
  );
  return response.data;
};

export const deleteSubjectCombination = async (id) => {
  const response = await http.delete(
    `/dictionaries/admin/subject-combinations/${id}`
  );
  return response.data;
};

/* Phương thức xét tuyển */
export const createAdmissionMethod = async (payload) => {
  const response = await http.post(
    "/dictionaries/admin/admission-methods",
    payload
  );
  return response.data;
};

export const updateAdmissionMethod = async (id, payload) => {
  const response = await http.put(
    `/dictionaries/admin/admission-methods/${id}`,
    payload
  );
  return response.data;
};

export const deleteAdmissionMethod = async (id) => {
  const response = await http.delete(
    `/dictionaries/admin/admission-methods/${id}`
  );
  return response.data;
};

/* Đợt đăng ký */
export const createRegistrationPeriod = async (payload) => {
  const response = await http.post(
    "/dictionaries/admin/registration-periods",
    payload
  );
  return response.data;
};

export const updateRegistrationPeriod = async (id, payload) => {
  const response = await http.put(
    `/dictionaries/admin/registration-periods/${id}`,
    payload
  );
  return response.data;
};

export const deleteRegistrationPeriod = async (id) => {
  const response = await http.delete(
    `/dictionaries/admin/registration-periods/${id}`
  );
  return response.data;
};

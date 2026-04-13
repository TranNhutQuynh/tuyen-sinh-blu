import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ApplicationForm from "../../components/forms/ApplicationForm";
import { getCandidateDetail, updateCandidate } from "../../api/adminApi";
import {
  PRIORITY_AREA_OPTIONS,
  PRIORITY_OBJECT_OPTIONS,
} from "../../utils/defaults";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function toDateInputValue(value) {
  if (!value) return "";

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return value.slice(0, 10);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeCandidateForForm(data) {
  if (!data) return null;

  const clone = JSON.parse(JSON.stringify(data));

  clone.birthDate = toDateInputValue(clone.birthDate);
  clone.personalInfo = clone.personalInfo || {};
  clone.reportCard = clone.reportCard || {};
  clone.thptExam = clone.thptExam || {};
  clone.gdnl = Array.isArray(clone.gdnl) ? clone.gdnl : [];
  clone.vsat = Array.isArray(clone.vsat) ? clone.vsat : [];
  clone.preferences = Array.isArray(clone.preferences) ? clone.preferences : [];

  clone.gdnl = clone.gdnl.map((item) => ({
    ...item,
    examDate: toDateInputValue(item.examDate),
  }));

  clone.vsat = clone.vsat.map((item) => ({
    ...item,
    examDate: toDateInputValue(item.examDate),
  }));

  return clone;
}

export default function AdminCandidateEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [options, setOptions] = useState({
    schools: [],
    majors: [],
    subjectCombinations: [],
    priorityAreas: PRIORITY_AREA_OPTIONS,
    priorityObjects: PRIORITY_OBJECT_OPTIONS,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [candidateResult, dictionaryResult] = await Promise.all([
          getCandidateDetail(id),
          axios.get(`${API_BASE_URL}/dictionaries/form-options`),
        ]);

        setInitialData(normalizeCandidateForForm(candidateResult.data));

        setOptions({
          schools: dictionaryResult.data.schools || [],
          majors: dictionaryResult.data.majors || [],
          subjectCombinations: dictionaryResult.data.subjectCombinations || [],
          priorityAreas: dictionaryResult.data.priorityAreas?.length
            ? dictionaryResult.data.priorityAreas
            : PRIORITY_AREA_OPTIONS,
          priorityObjects: dictionaryResult.data.priorityObjects?.length
            ? dictionaryResult.data.priorityObjects
            : PRIORITY_OBJECT_OPTIONS,
        });
      } catch (error) {
        window.alert(error.response?.data?.message || "Không tải được hồ sơ");
        navigate("/admin/candidates");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleSubmit = async (payload) => {
    try {
      setSubmitting(true);
      await updateCandidate(id, payload.data || payload);
      window.alert("Cập nhật hồ sơ thành công");
      navigate(`/admin/candidates/${id}`);
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Không cập nhật được hồ sơ"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Đang tải hồ sơ...</div>;
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div className="card section-card">
        <div className="card-body d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h1 className="h4 mb-1">Chỉnh sửa hồ sơ thí sinh</h1>
            <div className="small-muted">
              Admin chỉnh sửa sau khi đã kiểm tra thông tin hồ sơ.
            </div>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <Link
              className="btn btn-outline-secondary"
              to={`/admin/candidates/${id}`}
            >
              ← Quay lại xem hồ sơ
            </Link>
            <Link className="btn btn-outline-secondary" to="/admin/candidates">
              Về danh sách
            </Link>
          </div>
        </div>
      </div>

      <ApplicationForm
        mode="edit"
        initialData={initialData}
        submitLabel="Cập nhật hồ sơ"
        onSubmit={handleSubmit}
        submitting={submitting}
        schoolOptions={options.schools}
        majorOptions={options.majors}
        subjectCombinationOptions={options.subjectCombinations}
        priorityAreaOptions={options.priorityAreas}
        priorityObjectOptions={options.priorityObjects}
        existingReportCardEvidenceFiles={
          initialData?.reportCard?.evidenceFiles || []
        }
      />
    </div>
  );
}

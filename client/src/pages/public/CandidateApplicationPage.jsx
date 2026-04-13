import { useEffect, useState } from "react";
import axios from "axios";
import ApplicationForm from "../../components/forms/ApplicationForm";
import {
  PRIORITY_AREA_OPTIONS,
  PRIORITY_OBJECT_OPTIONS,
} from "../../utils/defaults";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CandidateApplicationPage() {
  const [submitting, setSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);

  const [options, setOptions] = useState({
    schools: [],
    majors: [],
    subjectCombinations: [],
    methods: [],
    periods: [],
    priorityAreas: PRIORITY_AREA_OPTIONS,
    priorityObjects: PRIORITY_OBJECT_OPTIONS,
  });

  useEffect(() => {
    const loadDictionaries = async () => {
      try {
        setLoadingOptions(true);

        const response = await axios.get(
          `${API_BASE_URL}/dictionaries/form-options`
        );

        setOptions({
          schools: response.data.schools || [],
          majors: response.data.majors || [],
          subjectCombinations: response.data.subjectCombinations || [],
          methods: response.data.methods || [],
          periods: response.data.periods || [],
          priorityAreas: response.data.priorityAreas?.length
            ? response.data.priorityAreas
            : PRIORITY_AREA_OPTIONS,
          priorityObjects: response.data.priorityObjects?.length
            ? response.data.priorityObjects
            : PRIORITY_OBJECT_OPTIONS,
        });
      } catch (error) {
        console.error("Không tải được danh mục:", error);
        window.alert(
          error.response?.data?.message || "Không tải được danh mục từ hệ thống"
        );
      } finally {
        setLoadingOptions(false);
      }
    };

    loadDictionaries();
  }, []);

  const handleSubmit = async ({ data, reportCardEvidenceFiles }) => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("application", JSON.stringify(data));

      reportCardEvidenceFiles.forEach((file) => {
        formData.append("reportCardEvidenceFiles", file);
      });

      await axios.post(`${API_BASE_URL}/candidates`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      window.alert("Lưu hồ sơ thành công.");
      setResetTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      window.alert(error.response?.data?.message || "Lưu hồ sơ thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOptions) {
    return <div>Đang tải danh mục đăng ký...</div>;
  }

  return (
    <ApplicationForm
      submitLabel="Lưu hồ sơ"
      onSubmit={handleSubmit}
      submitting={submitting}
      resetTrigger={resetTrigger}
      schoolOptions={options.schools}
      majorOptions={options.majors}
      subjectCombinationOptions={options.subjectCombinations}
      priorityAreaOptions={options.priorityAreas}
      priorityObjectOptions={options.priorityObjects}
    />
  );
}

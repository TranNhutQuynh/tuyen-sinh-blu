import { Navigate, Route, Routes } from "react-router-dom";
import CandidateApplicationPage from "./pages/public/CandidateApplicationPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCandidateListPage from "./pages/admin/AdminCandidateListPage";
import AdminCandidateDetailPage from "./pages/admin/AdminCandidateDetailPage";
import AdminCandidateEditPage from "./pages/admin/AdminCandidateEditPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import AdminCatalogPage from "./pages/admin/AdminCatalogPage";
import AdminRegistrationPeriodPage from "./pages/admin/AdminRegistrationPeriodPage";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <CandidateApplicationPage />
          </PublicLayout>
        }
      />

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="candidates" element={<AdminCandidateListPage />} />
        <Route path="candidates/:id" element={<AdminCandidateDetailPage />} />
        <Route
          path="candidates/:id/edit"
          element={<AdminCandidateEditPage />}
        />
        <Route path="catalogs" element={<AdminCatalogPage />} />
        <Route
          path="registration-periods"
          element={<AdminRegistrationPeriodPage />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

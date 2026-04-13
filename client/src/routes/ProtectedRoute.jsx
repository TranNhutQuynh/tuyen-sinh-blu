import { Navigate } from 'react-router-dom';

const ADMIN_TOKEN_KEY="admin_token"

export default function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

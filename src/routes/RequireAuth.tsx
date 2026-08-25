import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function RequireAuth() {
  const location = useLocation();
  const isAuthenticated = false;
  return isAuthenticated ? <Outlet /> : <Navigate replace state={{ from: location.pathname }} to="/login" />;
}

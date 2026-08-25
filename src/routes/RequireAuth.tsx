import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loading } from '../components';
import { useAuth } from '../features/auth/AuthContext';

export function RequireAuth() {
  const location = useLocation();
  const { user, isLoading } = useAuth();
  if (isLoading) return <Loading label="로그인 정보를 확인하는 중" />;
  return user ? <Outlet /> : <Navigate replace state={{ from: location.pathname }} to="/login" />;
}

import { createBrowserRouter } from 'react-router-dom';
import { AppLayout, AuthLayout } from '../components/layout';
import { NotFoundPage, PlaceholderPage } from '../pages';
import { RequireAuth } from './RequireAuth';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export const router = createBrowserRouter([
  { element: <AppLayout />, children: [
    { index: true, element: <PlaceholderPage title="나만의 와인 창고, WHYNE" /> },
    { path: 'wines', element: <PlaceholderPage title="와인 목록" /> },
    { path: 'wines/:wineId', element: <PlaceholderPage title="와인 상세" /> },
    { element: <RequireAuth />, children: [{ path: 'myprofile', element: <PlaceholderPage title="내 프로필" /> }] },
    { path: '*', element: <NotFoundPage /> },
  ] },
  { element: <AuthLayout />, children: [
    { path: 'login', element: <PlaceholderPage title="로그인" /> },
    { path: 'signup', element: <PlaceholderPage title="회원가입" /> },
  ] },
], { basename });

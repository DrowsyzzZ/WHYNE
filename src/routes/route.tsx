import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout, AuthLayout } from '../components/layout';
import { LandingPage } from '../pages/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { RequireAuth } from './RequireAuth';

// Route components intentionally live here so authentication pages stay code-split.
// eslint-disable-next-line react-refresh/only-export-components
const LoginPage = lazy(() => import('../pages/LoginPage').then((module) => ({ default: module.LoginPage })));
// eslint-disable-next-line react-refresh/only-export-components
const SignupPage = lazy(() => import('../pages/SignupPage').then((module) => ({ default: module.SignupPage })));

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export const router = createBrowserRouter([
  { index: true, element: <LandingPage /> },
  { element: <AppLayout />, children: [
    { path: 'wines', element: <PlaceholderPage title="와인 목록" /> },
    { path: 'wines/:wineId', element: <PlaceholderPage title="와인 상세" /> },
    { element: <RequireAuth />, children: [{ path: 'myprofile', element: <PlaceholderPage title="내 프로필" /> }] },
    { path: '*', element: <NotFoundPage /> },
  ] },
  { element: <AuthLayout />, children: [
    { path: 'login', element: <LoginPage /> },
    { path: 'signup', element: <SignupPage /> },
  ] },
], { basename });

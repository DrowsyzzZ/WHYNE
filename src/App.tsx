import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/route';
import { AuthProvider } from './features/auth/AuthContext';
import { Loading } from './components';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider><Suspense fallback={<Loading />}><RouterProvider router={router} /></Suspense></AuthProvider>
    </QueryClientProvider>
  );
}

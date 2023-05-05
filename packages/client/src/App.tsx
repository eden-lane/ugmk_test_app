import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { MainPage } from './pages/Main';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />
  },
]);

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { MainPage } from './pages/Main';
import { DetailsPage } from './pages/Details';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />
  },
  {
    path: '/details/:factoryId/:month',
    element: <DetailsPage />
  }
]);

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

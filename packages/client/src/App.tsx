import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DetailsPage } from './pages/Details';
import { MainPage } from './pages/Main';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/details/:factoryId/:month',
    element: <DetailsPage />,
  },
]);

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </QueryClientProvider>
  );
};

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }
`;

const Layout = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

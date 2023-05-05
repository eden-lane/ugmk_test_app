import React from 'react';
import { AllProductsChart } from '../../features/products/AllProductsChart';
import { useProductsQuery } from '../../features/products/products.api';

export const MainPage = () => {
  const { data: products } = useProductsQuery();

  return <AllProductsChart data={products} />;
};

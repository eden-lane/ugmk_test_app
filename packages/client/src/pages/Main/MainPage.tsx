import React, { useState } from 'react';
import { AllProductsChart } from '../../features/products/AllProductsChart';
import { ProductsSelector } from '../../features/products/ProductsSelector';
import { useProductsQuery } from '../../features/products/products.api';

export const MainPage = () => {
  const { data: products } = useProductsQuery();
  const [selectedProduct, setSelectedProduct] = useState('all');

  return (
    <>
      <ProductsSelector
        data={products}
        value={selectedProduct}
        onChange={setSelectedProduct}
      />
      <AllProductsChart data={products} selectedProduct={selectedProduct} />
    </>
  );
};

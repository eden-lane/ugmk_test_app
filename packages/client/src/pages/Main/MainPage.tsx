import React, { useState } from 'react';
import styled from 'styled-components';
import { AllProductsChart } from '../../features/products/AllProductsChart';
import { ProductsSelector } from '../../features/products/ProductsSelector';
import { useProductsQuery } from '../../features/products/products.api';

const SELECTED_PRODUCT_OPTION_KEY = 'ugmk:selectedProduct';

export const MainPage = () => {
  const { data } = useProductsQuery();
  const [selectedProduct, setSelectedProduct] = useState<string>(() => {
    const productId = localStorage.getItem(SELECTED_PRODUCT_OPTION_KEY);
    return productId || 'all';
  });

  const handleChangeProduct = (productId: string) => {
    localStorage.setItem(SELECTED_PRODUCT_OPTION_KEY, productId);
    setSelectedProduct(productId);
  };

  if (!data) {
    return <Root>Loading...</Root>;
  }

  return (
    <Root>
      <ProductsSelector
        data={data.products}
        value={selectedProduct}
        onChange={handleChangeProduct}
      />
      <AllProductsChart
        data={data.products}
        selectedProduct={selectedProduct}
      />
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;
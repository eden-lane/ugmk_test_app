import React, { useMemo } from 'react';
import { useProductDetails } from '../../features/products/products.api';
import { ProductDetailsChart } from '../../features/products/ProductDetailsChart';

export const DetailsPage = () => {
  const { data } = useProductDetails(1, 1);

  const products = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.products.reduce((result, product) => {
      product.products.forEach((p) => {
        const { id, value } = p;
        result[id] = (result[id] || 0) + value;
      });
      return result;
    }, {});
  }, [data]);

  if (!products) {
    return null;
  }

  return <ProductDetailsChart data={products} />;
};

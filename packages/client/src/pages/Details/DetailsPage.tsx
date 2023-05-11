import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetails } from '../../features/products/products.api';
import { ProductDetailsChart } from '../../features/products/ProductDetailsChart';
import { Product } from '../../features/products/products.types';

export const DetailsPage = () => {
  const { factoryId, month } = useParams<{
    factoryId: string;
    month: string;
  }>();

  const { data } = useProductDetails(Number(factoryId), Number(month));

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
    }, {} as Record<string, number>);
  }, [data]);

  if (!products) {
    return null;
  }

  return <ProductDetailsChart data={products} />;
};

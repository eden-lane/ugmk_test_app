import { index } from 'd3';
import React, { ChangeEvent, useEffect, useMemo } from 'react';
import { Product } from '../products.types';

type Props = {
  data: Product[];
  value: string;
  onChange(value: string): void;
};

export const ProductsSelector = (props: Props) => {
  const { data, value, onChange } = props;

  const products = useMemo(() => {
    if (!data) {
      return;
    }

    return data.reduce((prev, current) => {
      current.products.forEach((p) => {
        prev[p.id] = true;
      });

      return prev;
    }, {} as Record<string, boolean>);
  }, [data]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  }

  return (
    <select value={value} onChange={handleChange}>
      <option value="all">Все продукты</option>
      {products &&
        Object.keys(products).map((productId) => (
          <option key={productId} value={productId}>
            {productId}
          </option>
        ))}
    </select>
  );
};

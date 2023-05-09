import { index } from 'd3';
import React, { useEffect, useMemo } from 'react';

type Props = {
  data: any;
  value: string;
  onChange(value: string): void;
};

export const ProductsSelector = (props: Props) => {
  const { data, value, onChange } = props;

  const products = useMemo(() => {
    if (!data) {
      return;
    }

    return data.products.reduce((prev, current) => {
      current.products.forEach((p) => {
        prev[p.id] = true;
      });

      return prev;
    }, {});
  }, [data]);

  const handleChange = (event) => {
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

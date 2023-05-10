import React from 'react';
import { useProductDetails } from '../../features/products/products.api';

export const DetailsPage = () => {
  useProductDetails(1, 1);
  
  return <span>details</span>;
}
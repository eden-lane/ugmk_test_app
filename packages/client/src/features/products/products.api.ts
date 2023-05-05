import { useQuery } from '@tanstack/react-query';
import { env } from '../../config/env';

export const useProductsQuery = () => {
  return useQuery({ queryKey: ['products'], queryFn: getProducts });
};

const getProducts = () => {
  return fetch(`${env.API_URL}/products`).then((response) => response.json());
};

import { useQuery } from '@tanstack/react-query';
import { env } from '../../config/env';

export const useProductsQuery = () => {
  return useQuery({ queryKey: ['products'], queryFn: getProducts });
};

export const useProductDetails = (factoryId: number, month: number) => {
  return useQuery({
    queryKey: ['productDetails', factoryId, month],
    queryFn: () => getProductDetails(factoryId, month),
  });
};

const getProducts = () => {
  return fetch(`${env.API_URL}/products`).then((response) => response.json());
};

const getProductDetails = (factoryId: number, month: number) => {
  return fetch(`${env.API_URL}/products/details/${factoryId}/${month}`).then(
    (response) => response.json()
  );
};

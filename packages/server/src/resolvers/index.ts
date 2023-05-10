import { productDetails } from './products/details';
import { listProducts } from './products/list';

export const resolvers = {
  products: {
    list: listProducts,
    details: productDetails,
  },
};

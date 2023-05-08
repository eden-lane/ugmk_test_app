import { listProducts } from './products/list';

export const resolvers = {
  products: {
    list: listProducts,
  },
};

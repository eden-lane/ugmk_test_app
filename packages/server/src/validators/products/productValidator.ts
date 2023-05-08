import { ProductRaw } from '../../types/products';
import { parse } from 'date-fns';

export const productValidator = (product: ProductRaw) => {
  try {
    const isDateValid =
      product.date && parse(product.date, 'd/M/yyyy', new Date());
    const isFactoryValid = product.factory_id && parseInt(product.id, 10);

    return Boolean(isDateValid && isFactoryValid);
  } catch (error) {
    return false;
  }
};

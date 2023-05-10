import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import { parse } from 'date-fns';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Product, ProductRaw } from '../../types/products';
import { productValidator } from '../../validators/products/productValidator';

export const productDetails = async (
  request: FastifyRequest<{
    Params: {
      factoryId: string;
      month: string;
    };
  }>,
  reply: FastifyReply
) => {
  const { factoryId, month } = request.params;

  const fileName = path.resolve('./src/data/products.csv');
  const result: Array<Product> = [];
  const today = new Date();

  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', (product: ProductRaw) => {
      const { id, factory_id, date, ...products } = product;

      if (!productValidator(product)) {
        return;
      }

      result.push({
        id: parseInt(id, 10),
        factoryId: parseInt(factory_id, 10),
        date: parse(product.date, 'd/M/yyyy', today),
        products: Object.entries(products).map(([id, value]) => ({
          id,
          value: parseInt(value, 10),
        })),
      });
    })
    .on('end', () => {
      reply.send({
        products: result.filter((p) => {
          return (
            p.factoryId === Number(factoryId) &&
            p.date.getMonth() === Number(month) - 1
          );
        }),
      });
    });

  return reply;
};

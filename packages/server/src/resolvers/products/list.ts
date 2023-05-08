import { FastifyReply, FastifyRequest } from 'fastify';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { parse } from 'date-fns';
import { Product, ProductRaw } from '../../types/products';
import { productValidator } from '../../validators/products/productValidator';

export const listProducts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
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
        ...products
      });
    })
    .on('end', () =>
      reply.send({
        products: result,
      })
    );

  return reply;
};

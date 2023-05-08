import { fastify } from 'fastify';
import cors from '@fastify/cors';
import { resolvers } from './resolvers';

const server = fastify();

server.get('/', async () => {
  return { hello: 'world' };
});

/* Router */
server.get('/products', resolvers.products.list);

export const startServer = async () => {
  await server.register(cors, {
    origin: process.env.DISABLE_CORS === '1' ? false : true,
  });
  
  server.listen({
    port: 3001,
    host: '0.0.0.0',
  });

  console.log('Started server');
};

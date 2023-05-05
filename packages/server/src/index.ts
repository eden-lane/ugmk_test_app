import { fastify } from 'fastify';

const server = fastify();

server.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const startServer = async () => {
  server.listen({
    port: 3001,
    host: '0.0.0.0',
  });

  console.log('Started server')
};

startServer();
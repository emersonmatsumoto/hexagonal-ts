import Fastify from "fastify";
import { boardRoutes } from "./routes/boards";
import { fastifyAwilixPlugin, type FastifyAwilixOptions } from '@fastify/awilix'
import { BoardService, type Board } from "@kanban/application";
import { startRepository } from "@kanban/mongo";

export const bootstrap = async () => {
  const repo = await startRepository();
  const boardService = new BoardService(repo);

  return {
    boardService
  };
};

declare module 'fastify' {
  interface FastifyInstance {
    data: Awaited<ReturnType<typeof bootstrap>>;
  }
}

const fastify = Fastify({ logger: true });

// Registra rotas
fastify.register(boardRoutes, { prefix: "/boards" });

const start = async () => {
  try {
    const data = await bootstrap();
    fastify.decorate('data', data);

    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.child(err);
    process.exit(1);
  }
};

start();

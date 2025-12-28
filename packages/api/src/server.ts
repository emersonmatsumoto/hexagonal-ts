import Fastify from "fastify";
import { boardRoutes } from "./routes/boards";

const fastify = Fastify({ logger: true });

// Registra rotas
fastify.register(boardRoutes, { prefix: "/boards" });

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.child(err);
    process.exit(1);
  }
};

start();

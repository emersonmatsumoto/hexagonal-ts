import Fastify from "fastify";
import { boardRoutes } from "./routes/boards";

const fastify = Fastify({ logger: true });

// Registra rotas
fastify.register(boardRoutes, { prefix: "/boards" });

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("API rodando em http://localhost:3000");
  } catch (err) {
    fastify.log.child(err);
    process.exit(1);
  }
};

start();

import { FastifyPluginAsync } from "fastify";
import { InMemoryBoardRepository } from "@kanban/memory";
import { Board, BoardService } from "@kanban/application";

export const boardRoutes: FastifyPluginAsync = async (fastify) => {
  const repo = new InMemoryBoardRepository();
  const service = new BoardService(repo);

  // Criar um novo board
  fastify.post("/", async (request, reply) => {
    const { name } = request.body as { name: string };
    const board = await service.createBoard(name);
    return board;
  });

  // Listar boards
  fastify.get("/", async () => {
    return await repo.getAll();
  });

  // Adicionar coluna a board
  fastify.post("/:boardId/columns", async (request, reply) => {
    const { boardId } = request.params as { boardId: string };
    const { name } = request.body as { name: string };
    const board = await repo.getById(boardId);
    if (!board) return reply.status(404).send({ error: "Board not found" });
    const column = await service.addColumn(board, name);
    return column;
  });

  // Adicionar card a coluna
  fastify.post("/:boardId/columns/:columnId/cards", async (request, reply) => {
    const { boardId, columnId } = request.params as { boardId: string, columnId: string };
    const { title, description } = request.body as { title: string, description?: string };
    const board = await repo.getById(boardId);
    if (!board) return reply.status(404).send({ error: "Board not found" });
    const card = await service.addCard(board, columnId, title, description);
    return card;
  });
};

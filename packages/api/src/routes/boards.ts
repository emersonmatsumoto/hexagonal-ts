import { type FastifyPluginAsync } from "fastify";
// import { InMemoryBoardRepository } from "@kanban/memory";
import { MongoBoardRepository, startRepository } from "@kanban/mongo";
import { Board, BoardService } from "@kanban/application";


export const boardRoutes: FastifyPluginAsync = async (fastify) => {

  // Criar um novo board
  fastify.post("/", async (request, reply) => {
    const { name } = request.body as { name: string };
    const board = await fastify.data.boardService.createBoard(name);
    return board;
  });

  // Listar boards
  fastify.get("/", async () => {
    return await fastify.data.boardService.listBoards();
  });

  // Adicionar coluna a board
  fastify.post("/:boardId/columns", async (request, reply) => {
    const { boardId } = request.params as { boardId: string };
    const { name } = request.body as { name: string };
    const column = await fastify.data.boardService.addColumn(boardId, name);
    return column;
  });

  // Adicionar card a coluna
  fastify.post("/:boardId/columns/:columnId/cards", async (request, reply) => {
    const { boardId, columnId } = request.params as { boardId: string, columnId: string };
    const { title, description } = request.body as { title: string, description?: string };
    const card = await fastify.data.boardService.addCard(boardId, columnId, title, description);
    return card;
  });
};

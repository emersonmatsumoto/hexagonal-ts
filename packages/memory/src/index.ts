import { Board, type BoardRepository } from "@kanban/application";

export class InMemoryBoardRepository implements BoardRepository {
  private boards: Map<string, Board> = new Map();

  save(board: Board): Promise<void> {
    this.boards.set(board.id, board)

    return Promise.resolve();
  }

  async getById(id: string): Promise<Board | null> {
    const board = this.boards.get(id);

    return board ?? null;
  }

  getAll(): Promise<Board[]> {
    const boards = Array.from(this.boards.values());

    return Promise.resolve(boards);
  }

  delete(id: string): Promise<void> {
    this.boards.delete(id);

    return Promise.resolve();
  }
}

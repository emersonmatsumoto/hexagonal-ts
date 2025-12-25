import { Board, BoardRepository } from "@kanban/application";

export class InMemoryBoardRepository implements BoardRepository {
  private boards: Map<string, Board> = new Map();

  save(board: Board): Promise<void> {
    this.boards.set(board.id, board)

    return Promise.resolve();
  }

  getById(id: string): Promise<Board | undefined> {
    const board = this.boards.get(id);

    return Promise.resolve(board);
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

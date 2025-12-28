import { Board, Column, Card } from "../domain";
import { type BoardRepository } from "../port/board-repository";

export class BoardService {
  constructor(private repo: BoardRepository) { }

  async listBoards(): Promise<Board[]> {
    const boards = await this.repo.getAll();
    return boards
  }

  async createBoard(name: string): Promise<Board> {
    const board = new Board(name);
    const newBoard = await this.repo.save(board);
    return newBoard;
  }

  async addColumn(boardId: string, name: string): Promise<Column> {
    const board = await this.repo.getById(boardId);
    if (!board) throw new Error("Board not found");

    const column = new Column(name);
    board.addColumn(column);
    await this.repo.save(board);
    return column;
  }

  async addCard(boardId: string, columnId: string, title: string, description?: string): Promise<Card> {
    const board = await this.repo.getById(boardId);
    if (!board) throw new Error("Board not found");

    const column = board.getColumns().find(c => c.id === columnId);
    if (!column) throw new Error("Column not found");

    const card = new Card(title, description);
    column.addCard(card);
    await this.repo.save(board);
    return card;
  }
}

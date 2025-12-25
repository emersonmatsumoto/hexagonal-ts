import { Board, Column, Card } from "../domain";
import { BoardRepository } from "../port/board-repository";

export class BoardService {
  constructor(private repo: BoardRepository) { }

  async createBoard(name: string): Promise<Board> {
    const board = new Board(crypto.randomUUID(), name);
    await this.repo.save(board);
    return board;
  }

  async addColumn(board: Board, name: string): Promise<Column> {
    const column = new Column(crypto.randomUUID(), name);
    board.addColumn(column);
    await this.repo.save(board);
    return column;
  }

  async addCard(board: Board, columnId: string, title: string, description?: string): Promise<Card> {
    const column = board.getColumns().find(c => c.id === columnId);
    if (!column) throw new Error("Column not found");

    const card = new Card(crypto.randomUUID(), title, description);
    column.addCard(card);
    await this.repo.save(board);
    return card;
  }
}

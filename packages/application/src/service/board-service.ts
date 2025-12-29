import { Board, Column, Card } from "../domain";
import { type BoardRepository } from "../port/board-repository";

export class BoardService {
  constructor(private repo: BoardRepository) { }

  async getBoard(boardId: string): Promise<Board> {
    const board = await this.repo.getById(boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    return board
  }

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
    const column = new Column(name);
    const newColumn = await this.repo.saveColumn(boardId, column);
    return newColumn;
  }

  async addCard(boardId: string, columnId: string, title: string, description?: string): Promise<Card> {
    const card = new Card(title, description);
    const newCard = await this.repo.saveCard(boardId, columnId, card);
    return newCard;
  }

  async moveCardBetweenColumns(boardId: string, cardId: string, fromColId: string, toColId: string) {
    const board = await this.repo.getById(boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    board.moveCard(cardId, fromColId, toColId);

    await this.repo.save(board);

    return board;
  }
}

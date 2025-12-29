import { Board, Card, Column } from "../domain";

export interface BoardRepository {
  save(board: Board): Promise<Board>;
  saveColumn(boardId: string, column: Column): Promise<Column>;
  saveCard(boardId: string, columnId: string, card: Card): Promise<Card>
  getById(id: string): Promise<Board | null>;
  getAll(): Promise<Board[]>;
  delete(id: string): Promise<void>;
}

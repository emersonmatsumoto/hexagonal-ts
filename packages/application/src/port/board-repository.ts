import { Board } from "../domain";

export interface BoardRepository {
  save(board: Board): Promise<Board>;
  getById(id: string): Promise<Board | null>;
  getAll(): Promise<Board[]>;
  delete(id: string): Promise<void>;
}

import { Board } from "../domain";

export interface BoardRepository {
  save(board: Board): Promise<void>;
  getById(id: string): Promise<Board | null>;
  getAll(): Promise<Board[]>;
  delete(id: string): Promise<void>;
}
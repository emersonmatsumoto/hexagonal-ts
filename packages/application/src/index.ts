import { Board } from "@kanban/domain";
import { BoardService } from "./board-service";

const board = new Board("1", "Meu Kanban");
const service = new BoardService(board);

const todo = service.addColumn("To Do");
const doing = service.addColumn("Doing");

const card = service.addCard(todo.id, "Estudar TypeScript");

console.log(board.getColumns().map(c => ({
  name: c.name,
  cards: c.getCards().map(card => card.title)
})));

service.moveCard(card.id, todo.id, doing.id);

console.log(board.getColumns().map(c => ({
  name: c.name,
  cards: c.getCards().map(card => card.title)
})));

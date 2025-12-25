import { Board, Card, Column } from "@kanban/domain";

export class BoardService {
  constructor(private board: Board) { }

  addColumn(name: string) {
    const column = new Column(crypto.randomUUID(), name);
    this.board.addColumn(column);
    return column;
  }

  addCard(columnId: string, title: string, description?: string) {
    const column = this.board.getColumns().find(c => c.id === columnId);
    if (!column) throw new Error("Column not found");
    const card = new Card(crypto.randomUUID(), title, description);
    column.addCard(card);
    return card;
  }

  moveCard(cardId: string, fromColumnId: string, toColumnId: string) {
    const fromColumn = this.board.getColumns().find(c => c.id === fromColumnId);
    const toColumn = this.board.getColumns().find(c => c.id === toColumnId);
    if (!fromColumn || !toColumn) throw new Error("Column not found");

    const card = fromColumn.getCards().find(c => c.id === cardId);
    if (!card) throw new Error("Card not found in source column");

    fromColumn.removeCard(cardId);
    toColumn.addCard(card);
  }
}

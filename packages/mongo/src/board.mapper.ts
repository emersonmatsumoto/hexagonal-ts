import { ObjectId } from "mongodb";
import { Board, Card, Column } from "@kanban/application";

export type CardDocument = {
  _id: ObjectId;
  title: string;
  description?: string;
}

export type ColumnDocument = {
  _id: ObjectId;
  name: string;
  cards: CardDocument[];
}

export interface BoardDocument {
  _id: ObjectId;
  name: string;
  columns: ColumnDocument[];
}

export function cardToDocument(card: Card): CardDocument {
  return {
    _id: card.id ? new ObjectId(card.id) : new ObjectId(),
    title: card.title,
    description: card.description
  }
}

export function columnToDocument(column: Column): ColumnDocument {
  return {
    _id: column.id ? new ObjectId(column.id) : new ObjectId(),
    name: column.name,
    cards: column.getCards().map(cardToDocument)
  }
}

export function boardToDocument(board: Board): BoardDocument {
  return {
    _id: board.id ? new ObjectId(board.id) : new ObjectId(),
    name: board.name,
    columns: board.getColumns().map(columnToDocument)
  }
}

export function cardToDomain(cardDocument: CardDocument): Card {
  const card = new Card(cardDocument.title, cardDocument.description, cardDocument._id.toHexString());

  return card
}

export function columnToDomain(columnDocument: ColumnDocument): Column {
  let column = new Column(columnDocument.name, columnDocument._id.toHexString());

  for (const cardDocument of columnDocument.cards) {
    const card = cardToDomain(cardDocument);
    column.addCard(card);
  }

  return column
}

export function boardToDomain(boardDocument: BoardDocument): Board {
  let board = new Board(boardDocument.name, boardDocument._id.toHexString());

  for (const columnDocument of boardDocument.columns) {
    const column = columnToDomain(columnDocument)
    board.addColumn(column);

  }

  return board;
}


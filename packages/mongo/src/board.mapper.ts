import { ObjectId } from "mongodb";
import { Board, Card, Column } from "@kanban/application";

// A interface que define como o dado vive no MongoDB
export interface BoardDocument {
  _id: ObjectId;
  name: string;
  columns: {
    _id: ObjectId;
    name: string;
    cards: {
      _id: ObjectId;
      title: string;
      description?: string;
    }[];
  }[];
}

export class BoardMapper {
  /**
   * Transforma o objeto de Domínio em um Documento do MongoDB
   */
  static toDocument(board: Board): BoardDocument {
    return {
      _id: board.id ? new ObjectId(board.id) : new ObjectId(),
      name: board.name,
      columns: board.getColumns().map(col => ({
        _id: col.id ? new ObjectId(col.id) : new ObjectId(),
        name: col.name,
        cards: col.getCards().map(card => ({
          _id: card.id ? new ObjectId(card.id) : new ObjectId(),
          title: card.title,
          description: card.description
        }))
      }))
    };
  }

  /**
   * Reconstrói o Domínio utilizando os métodos addColumn e addCard
   */
  static toDomain(doc: BoardDocument): Board {
    // 1. Instancia o Board base (vazio)
    let board = new Board(doc.name, doc._id.toHexString());

    // 2. Percorre as colunas do documento
    for (const colData of doc.columns) {
      let column = new Column(colData.name, colData._id.toHexString());

      // 3. Percorre os cards e usa addCard (cada chamada gera uma nova instância de Column)
      for (const cardData of colData.cards) {
        const card = new Card(cardData.title, cardData.description, cardData._id.toHexString());
        column.addCard(card);
      }

      // 4. Adiciona a coluna completa ao Board (gera uma nova instância de Board)
      board.addColumn(column);
    }

    return board;
  }
}

import { Collection, MongoClient, ObjectId } from "mongodb";
import { type BoardRepository, Board, Card, Column } from "@kanban/application";
import { boardToDocument, boardToDomain, type BoardDocument, columnToDocument, columnToDomain, cardToDocument, cardToDomain } from "./board.mapper";

export class MongoBoardRepository implements BoardRepository {
  constructor(private readonly collection: Collection<BoardDocument>) { }

  async save(board: Board): Promise<Board> {
    const doc = boardToDocument(board);

    await this.collection.updateOne(
      { _id: doc._id },
      { $set: doc },
      { upsert: true }
    );

    return boardToDomain(doc)
  }

  async saveColumn(boardId: string, column: Column): Promise<Column> {
    const doc = columnToDocument(column);

    const result = await this.collection.updateOne(
      { _id: new ObjectId(boardId), "columns._id": doc._id },
      { $set: { "columns.$": doc } }
    );

    if (result.matchedCount === 0) {
      await this.collection.updateOne(
        { _id: new ObjectId(boardId) },
        { $push: { columns: doc } }
      );
    }

    return columnToDomain(doc)
  }

  async saveCard(
    boardId: string,
    columnId: string,
    card: Card,
  ): Promise<Card> {
    const doc = cardToDocument(card)
    const result = await this.collection.updateOne(
      {
        _id: new ObjectId(boardId),
        "columns._id": new ObjectId(columnId),
        "columns.cards._id": doc._id
      },
      {
        $set: { "columns.$[col].cards.$[card]": doc }
      },
      {
        arrayFilters: [
          { "col._id": new ObjectId(columnId) },
          { "card._id": doc._id }
        ]
      }
    );

    if (result.matchedCount === 0) {
      await this.collection.updateOne(
        {
          _id: new ObjectId(boardId),
          "columns._id": new ObjectId(columnId)
        },
        {
          $push: { "columns.$.cards": doc }
        }
      );
    }

    return cardToDomain(doc)
  }

  async getById(id: string): Promise<Board | null> {
    if (!ObjectId.isValid(id)) return null;

    const doc = await this.collection.findOne({ _id: new ObjectId(id) });

    if (!doc) {
      return null
    }

    return boardToDomain(doc)
  }

  async getAll(): Promise<Board[]> {
    const boards = await this.collection.find({}).toArray();

    return boards.map(boardToDomain)
  }

  async delete(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}

export async function startRepository() {
  const uri = process.env.MONGO_URL;
  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD;

  if (!uri || !username || !password) {
    console.log("erro")
    throw new Error("Erro: Variáveis de ambiente do MongoDB não configuradas.")
  }

  const client = new MongoClient(uri, {
    auth: {
      username,
      password,
    }
  });


  await client.connect();

  const db = client.db("kanban");
  const boardCollection = db.collection<BoardDocument>("boards");

  const repo = new MongoBoardRepository(boardCollection);

  return repo;

}

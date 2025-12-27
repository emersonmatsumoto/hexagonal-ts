import { Collection, MongoClient, ObjectId } from "mongodb";
import { type BoardRepository, Board, Column } from "@kanban/application";
import { BoardMapper, type BoardDocument } from "./board.mapper";


export class MongoBoardRepository implements BoardRepository {
  constructor(private readonly collection: Collection<BoardDocument>) { }

  async save(board: Board): Promise<Board> {
    const doc = BoardMapper.toDocument(board);

    await this.collection.updateOne(
      { _id: doc._id },
      { $set: doc },
      { upsert: true }
    );

    return BoardMapper.toDomain(doc)
  }

  async getById(id: string): Promise<Board | null> {
    if (!ObjectId.isValid(id)) return null;

    const doc = await this.collection.findOne({ _id: new ObjectId(id) });

    if (!doc) {
      return null
    }

    return BoardMapper.toDomain(doc)
  }

  async getAll(): Promise<Board[]> {
    const boards = await this.collection.find({}).toArray();

    return boards.map(BoardMapper.toDomain)
  }

  async delete(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}

export async function startRepository() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri, {
    auth: {
      username: "root",
      password: "example"
    }
  });


  // 2. Conecta ao servidor
  await client.connect();

  // 3. Seleciona o banco de dados e a coleção
  const db = client.db("kanban");
  const boardCollection = db.collection<BoardDocument>("boards");

  // 4. Agora você pode instanciar seu repositório
  const repo = new MongoBoardRepository(boardCollection);

  return repo;

}

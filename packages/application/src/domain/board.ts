import { Column } from "./column";

export class Board {
  public columns: Column[] = [];

  constructor(public name: string, public id?: string) { }

  assignId(id: string) {
    if (this.id) throw new Error("ID já atribuído");
    this.id = id;
  }

  addColumn(column: Column) {
    this.columns.push(column);
  }

  removeColumn(columnId: string) {
    this.columns = this.columns.filter(c => c.id !== columnId);
  }

  getColumns(): Column[] {
    return [...this.columns];
  }

  private findColumn(columnId: string): Column {
    const column = this.columns.find(c => c.id === columnId);
    if (!column) {
      throw new Error(`Coluna ${columnId} não encontrada.`);
    }
    return column;
  }

  moveCard(cardId: string, fromColumnId: string, toColumnId: string) {
    const fromColumn = this.findColumn(fromColumnId);
    const toColumn = this.findColumn(toColumnId);

    const card = fromColumn.getCards().find(c => c.id === cardId);

    if (!card) {
      throw new Error(`Card ${cardId} não encontrado na coluna de origem.`);
    }

    fromColumn.removeCard(cardId);
    toColumn.addCard(card);
  }
}

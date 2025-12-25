import { Column } from "./column";

export class Board {
  private columns: Column[] = [];

  constructor(public id: string, public name: string) {}

  addColumn(column: Column) {
    this.columns.push(column);
  }

  removeColumn(columnId: string) {
    this.columns = this.columns.filter(c => c.id !== columnId);
  }

  getColumns(): Column[] {
    return this.columns;
  }
}

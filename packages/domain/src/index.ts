export class Board {
  constructor(public name: string) {}

  info() {
    return `Board: ${this.name}`;
  }
}

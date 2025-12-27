import { Card } from "./card";

export class Column {
  private cards: Card[] = [];

  constructor(public name: string, public id?: string) { }

  assignId(id: string) {
    if (this.id) throw new Error("ID da Coluna já atribuído.");
    this.id = id;
  }

  addCard(card: Card) {
    this.cards.push(card);
  }

  removeCard(cardId: string) {
    this.cards = this.cards.filter(c => c.id !== cardId);
  }

  getCards(): Card[] {
    return [...this.cards];
  }
}

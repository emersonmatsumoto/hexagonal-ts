import { Card } from "./card";

export class Column {
  private cards: Card[] = [];

  constructor(public id: string, public name: string) {}

  addCard(card: Card) {
    this.cards.push(card);
  }

  removeCard(cardId: string) {
    this.cards = this.cards.filter(c => c.id !== cardId);
  }

  getCards(): Card[] {
    return this.cards;
  }
}

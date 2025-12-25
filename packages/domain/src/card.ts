export class Card {
  constructor(public id: string, public title: string, public description?: string) {}

  updateTitle(newTitle: string) {
    if (!newTitle) throw new Error("Title cannot be empty");
    this.title = newTitle;
  }

  updateDescription(newDescription: string) {
    this.description = newDescription;
  }
}

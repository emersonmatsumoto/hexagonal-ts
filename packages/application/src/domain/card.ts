export class Card {
  constructor(public title: string, public description?: string, public id?: string) {}

  assignId(id: string) {
    if (this.id) throw new Error("ID do Board já atribuído.");
    this.id = id;
  }

  updateTitle(newTitle: string) {
    if (!newTitle) throw new Error("Title cannot be empty");
    this.title = newTitle;
  }

  updateDescription(newDescription: string) {
    this.description = newDescription;
  }
}

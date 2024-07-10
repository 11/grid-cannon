import Card, { CardFaces, CardSuits } from './card.js'
import CardStack from './card-stack.js'

export default class Deck {
  get size() {
    return this.cards.size
  }

  private cards: CardStack

  public constructor() {
    this.cards = new CardStack()
    this.buildNewOrderedDeck()
  }

  public buildNewOrderedDeck(reset: boolean = false): void {
    if (reset) {
      this.cards = new CardStack()
    }

    for (const suit of Object.values(CardSuits)) {
      for (const name of Object.values(CardFaces)) {
        if (name === CardFaces.JOKER) {
          continue
        }

        const card = new Card(name, suit)
        this.cards.push(card)
      }
    }

    this.cards.push(new Card(CardFaces.JOKER, null))
    this.cards.push(new Card(CardFaces.JOKER, null))
  }

  public deal(): Card | null {
    if (this.size === 0) {
      // this.reset()
      this.cards.shuffle()
    }

    return this.cards.pop()
  }

  public shuffle(): void {
    this.cards.shuffle()
  }

  public pop(): Card | null {
    return this.cards.pop()
  }
}
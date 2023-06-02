import Deck from './deck.js'
import Card from './card.js'
import Grid from './grid.js'

export default class Game {
  constructor() {
    this.deck = null
    this.grid = null

    this.newGame = false
  }

  start() {
    this.deck = new Deck()
    this.grid = new Grid(this.deck)

    this.render()

    // draw a card
    // place card if there is a spot avaiable
    //   it's on a corner
    // otherwise card becomes armor on smallest face card
    //


    // this.newGame = true
    // while (this.newGame) {
    // }
  }

  render() {
    this.grid.render()
  }
}

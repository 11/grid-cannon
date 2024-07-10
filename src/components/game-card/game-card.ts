import { LitElement, html } from 'lit'
import * as S from './game-card.style'

export class GameCard extends LitElement {
  static styles = [
    S.Card,
    S.CardFace,
    S.CardEmpty,
    S.CardSelected,
    S.CardBack,
    S.CardHidden,
  ]

  static properties = {
    gridX: { type: Number },
    gridY: { type: Number },
    isGameCard: { type: Boolean },
    isFaceShowing: { type: Boolean },
    isHidden: { type: Boolean},
    isEmpty: { type: Boolean },
    suit: { type: String },
    rank: { type: String }
  }

  gridX: number
  gridY: number
  isGameCard: boolean
  isFaceShowing: boolean
  isHidden: boolean
  isEmpty: boolean
  suit: string
  rank: string

  constructor() {
    super()

    this.gridX = 0
    this.gridY = 0
    this.isGameCard = true
    this.isFaceShowing = true
    this.isHidden = false
    this.isEmpty = true
    this.suit = ''
    this.rank = ''
  }

  render() {
    let classMap = 'card'

    if (this.isHidden) {
      classMap += ' hidden'
    }

    if (this.isEmpty) {
      classMap += ' empty'
    }

    if (!this.isFaceShowing) {
      classMap += ' card-back'
    }

    return html`
      <div
        class='${classMap}'
        data-grid-x='${this.gridX}'
        data-grid-y='${this.gridY}'
        data-game-card='${this.isGameCard}'
      >
        <slot></slot>
      </div>
    `
  }
}

customElements.define('game-card', GameCard)
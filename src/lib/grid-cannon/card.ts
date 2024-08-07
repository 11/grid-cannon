import { isNil } from 'lodash'

export enum CardFaces {
  JOKER = 'JOKER',
  ACE = 'ACE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
  SEVEN = 'SEVEN',
  EIGHT = 'EIGHT',
  NINE = 'NINE',
  TEN = 'TEN',
  JACK = 'JACK',
  QUEEN = 'QUEEN',
  KING = 'KING',
}

export enum CardSuits {
  SPADE = 'SPADE',
  CLUB = 'CLUB',
  HEART = 'HEART',
  DIAMOND = 'DIAMOND',
  NULL = 'NULL',
}

export const CardSuitToSymbolMap = {
  [CardSuits.NULL]: '',
  [CardSuits.SPADE]: '\u2660',
  [CardSuits.CLUB]: '\u2663',
  [CardSuits.HEART]: '\u2665',
  [CardSuits.DIAMOND]: '\u2666',
}

export const CardFaceToRankMap = {
  [CardFaces.JOKER]: 0,
  [CardFaces.ACE]: 1,
  [CardFaces.TWO]: 2,
  [CardFaces.THREE]: 3,
  [CardFaces.FOUR]: 4,
  [CardFaces.FIVE]: 5,
  [CardFaces.SIX]: 6,
  [CardFaces.SEVEN]: 7,
  [CardFaces.EIGHT]: 8,
  [CardFaces.NINE]: 9,
  [CardFaces.TEN]: 10,
  [CardFaces.JACK]: 11,
  [CardFaces.QUEEN]: 12,
  [CardFaces.KING]: 13,
}

export const CardFaceToAbbreviationMap = {
  [CardFaces.JOKER]: 'JOKER',
  [CardFaces.ACE]: 'A',
  [CardFaces.TWO]: '2',
  [CardFaces.THREE]: '3',
  [CardFaces.FOUR]: '4',
  [CardFaces.FIVE]: '5',
  [CardFaces.SIX]: '6',
  [CardFaces.SEVEN]: '7',
  [CardFaces.EIGHT]: '8',
  [CardFaces.NINE]: '9',
  [CardFaces.TEN]: '10',
  [CardFaces.JACK]: 'J',
  [CardFaces.QUEEN]: 'Q',
  [CardFaces.KING]: 'K',
}

export type CardColors = 'RED' | 'BLACK'
export const CardColorMap: Record<string, CardColors> = {
  [CardSuits.NULL]: 'BLACK', // JOKERS have no suit, so they default to black
  [CardSuits.SPADE]: 'BLACK',
  [CardSuits.CLUB]: 'BLACK',
  [CardSuits.HEART]: 'RED',
  [CardSuits.DIAMOND]: 'RED',
}

export interface CardAttributes {
  gridX: number | null
  gridY: number | null
  rank: number
  name: CardFaces
  suit: CardSuits | null
  symbol: string
  abbreviation: string
  value: number
  color: CardColors
  cardText: string
  score: number
  stackSize: number
  isNumber: boolean
  isFace: boolean
  isJoker: boolean
  isAce: boolean
  isDead: boolean
  isUpsideDown: boolean
  isHighlighted: boolean
}

export type UpdateableCardFields = 'value' | 'gridX' | 'gridY' | 'isDead' | 'isUpsideDown' | 'isHighlighted' | 'stackSize'

export default class Card {
  /**
   * JOKER
   * ACE
   * ...
   * TEN
   * JACK
   * QUEEN
   * KING
   */
  private name: CardFaces

  /**
   * JOKER => JOKER
   * ACE => A
   * TWO => 2
   * ...
   * TEN => 10
   * JACK => J
   * QUEEN => Q
   * KING => K
   */
  private abbreviation: string

  /**
   * SPADE
   * HEART
   * CLUB
   * DIAMOND
   */
  private suit: CardSuits

  /**
   * Unicode symbols for card suits:
   * ♠ ♥ ♦ ♣
   */
  private symbol: string

  /**
   * JOKER => 0
   * ACE => 1
   * TWO => 2
   * TEN => 10
   * JACK => 11
   * QUEEN => 12
   * KING => 13
   */
  private rank: number

  /**
   * During the the game, some card's values can increase. `value` keeps track
   * of the flucuating values in throughout the game
   */
  private value: number

  // Suit color
  private color: CardColors

  // Scores for each card
  // King => 3
  // Queen => 2
  // Jack => 1
  private score: number

  private stackSize: number

  // If a face card has been isKilled
  private isDead: boolean

  // Stores if front or back of card should be rendered
  private isUpsideDown: boolean

  private isHighlighted: boolean



  /**
   * Grid position
   */
  private gridX: number | null
  private gridY: number | null

  constructor(name: CardFaces, suit: CardSuits) {
    this.name = name
    this.suit = suit
    this.gridX = null
    this.gridY = null
    this.abbreviation = CardFaceToAbbreviationMap[this.name]
    this.color = CardColorMap[this.suit]
    this.symbol = CardSuitToSymbolMap[this.suit]
    this.rank = CardFaceToRankMap[this.name]
    this.score = (this.rank <= 10) ? 0 : Math.abs(this.rank - 10)
    this.stackSize = 0
    this.value = this.rank
    this.isDead = false
    this.isUpsideDown = true
    this.isHighlighted = false
  }

  public get GridX() {
    return this.gridX
  }

  public get GridY() {
    return this.gridY
  }

  public get GridPosition() {
    return [this.gridX, this.gridY]
  }

  public get Score() {
    return this.score
  }

  public get Rank() {
    return this.rank
  }

  public get Value() {
    return this.value
  }

  public get Suit() {
    return this.suit
  }

  public get CardText() {
    return `${this.abbreviation} ${this.symbol}`.trim()
  }

  public get Color() {
    return this.color
  }

  public get isNumber(): boolean {
    return this.rank >= 2 && this.rank <= 10
  }

  public get IsFace() {
    return this.rank > 10
  }

  public get IsJoker() {
    return this.rank === 0
  }

  public get IsAce() {
    return this.rank === 1
  }

  public get IsHighlighted() {
    return this.isHighlighted
  }

  public get IsDead() {
    return this.isDead
  }

  public get Abbreviation() {
    return this.abbreviation
  }

  public update(card: Partial<Pick<CardAttributes, UpdateableCardFields>>) {
    if (!isNil(card.value)) {
      this.value = card.value
    }

    if (!isNil(card.gridX)) {
      this.gridX = card.gridX
    }

    if (!isNil(card.gridY)) {
      this.gridY = card.gridY
    }

    if (!isNil(card.stackSize)) {
      this.stackSize = card.stackSize
    }

    if (!isNil(card.isDead)) {
      this.isDead = card.isDead
    }

    if (!isNil(card.isUpsideDown)) {
      this.isUpsideDown = card.isUpsideDown
    }

    if (!isNil(card.isHighlighted)) {
      this.isHighlighted= card.isHighlighted
    }
  }

  public toJSON(): CardAttributes {
    return {
      gridX: this.gridX,
      gridY: this.gridY,
      rank: this.rank,
      suit: this.suit,
      name: this.name,
      symbol: this.symbol,
      abbreviation: this.abbreviation,
      value: this.value,
      color: this.color,
      score: this.score,
      stackSize: this.stackSize,
      isNumber: this.isNumber,
      isFace: this.IsFace,
      isJoker: this.IsJoker,
      isAce: this.IsAce,
      cardText: this.CardText,
      isDead: this.isDead,
      isUpsideDown: this.isUpsideDown,
      isHighlighted: this.isHighlighted,
    }
  }
}

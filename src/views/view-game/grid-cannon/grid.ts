// import Game from './game'
import { isNil } from 'lodash'
import Card from './card'
import CardStack from './card-stack'

export default class Grid {
  // get htmlGrid() {
  //   return Array.from(document.querySelectorAll('.game-grid > [data-game-card="true"]'))
  // }

  /**
   * game grid
   */
  private grid: Array<CardStack | null>

  /**
   * valid grid X and Y position for each type of card
   */
  private readonly startNumberPositions: number[][] = [[1,1], [1,2], [1,3], [2,1], [2,3], [3,1], [3,2], [3,3]]
  private readonly numberedPositions: number[][] = [[1,1], [1,2], [1,3], [2,1], [2,2], [2,3], [3,1], [3,2], [3,3]]
  private readonly facePositions: number[][] = [[0,1], [0,2], [0,3], [1,0], [1,4], [2,0], [2,4], [3,0], [3,4], [4,1], [4,2],[4,3]]

  constructor() {
    this.grid = [
      null,            new CardStack(), new CardStack(), new CardStack(), null,
      new CardStack(), new CardStack(), new CardStack(), new CardStack(), new CardStack(),
      new CardStack(), new CardStack(), new CardStack(), new CardStack(), new CardStack(),
      new CardStack(), new CardStack(), new CardStack(), new CardStack(), new CardStack(),
      null,            new CardStack(), new CardStack(), new CardStack(), null,
    ]
  }

  // bindGameEvents(chooseGridPositionEvent) {
  //   this.htmlGrid.forEach(cardElement => {
  //     if (!cardElement.classList.contains('hidden')) {
  //       cardElement.onclick = chooseGridPositionEvent.bind(window.game)
  //     }
  //   })
  // }

  // _clearScreen() {
  //   const htmlGrid = this.htmlGrid

  //   for (let i = 0; i < this._grid.length; i++) {
  //     const card = this._grid[i]
  //     const cardDiv = htmlGrid[i]
  //     if (cardDiv.classList.contains('hidden')) {
  //       continue
  //     } else if (!card) {
  //       cardDiv.classList.add('empty')
  //     }

  //     cardDiv.textContent = ''
  //     cardDiv.style.color = ''
  //   }
  // }

  public setup() {
    const generateNewGridByDifficulty = () => {
      const gameDifficulty = new Set([3, 7])

      let spots, faces, aces, jokers
      do {
        spots = []
        faces = []
        aces = []
        jokers = []

        window.game.deck.newOrderedDeck()
        window.game.deck.shuffle()

        while (spots.length <= 7) {
          const card = window.game.deck.pop()
          if (card.isFace) {
            faces.push(card)
          } else if (card.isJoker) {
            jokers.push(card)
          } else if (card.isAce) {
            aces.push(card)
          } else {
            spots.push(card)
          }
        }
      } while(!gameDifficulty.has(faces.length))

      return {
        faces,
        spots,
        jokers,
        aces,
      }
    }

    const placeNumberedCardsInGrid = (numberedCards: Card[]) => {
      for (const [gridX, gridY] of this.startNumberPositions) {
        const card = numberedCards.shift()
        if (isNil(card)) {
          throw new Error('No numbered cards when setting up grid')
        }

        card.update({
          gridX,
          gridY,
        })

        this.push(gridX, gridY, card)
      }
    }

    const {
      faces,
      spots,
      jokers,
      aces,
    } = generateNewGridByDifficulty()
    placeNumberedCardsInGrid(spots)

    let faceCard
    while (faceCard = faces.pop()) {
      const positionsRankedByCardAttributes = this.findValidGridPlacements(faceCard)
      const bestPosition = positionsRankedByCardAttributes[0]
      const [xStr, yStr] = bestPosition
      this.push(parseInt(xStr), parseInt(yStr), faceCard)
    }

    let joker
    while(joker = jokers.pop()) {
      window.game.controls.putJokers(joker)
    }

    let ace
    while (ace = aces.pop()) {
      window.game.controls.putAces(ace)
    }
  }

  // getCardHtmlFromGridPosition(x, y) {
  //   const stride = (5 * x) + y
  //   return this.htmlGrid.at(stride)
  // }

  public peek(x: number, y: number): Card | null {
    const stride = (5 * x) + y
    const card = this.grid.at(stride)?.peek()
    if (isNil(card)) {
      return null
    }

    return card
  }

  public pop(x: number, y: number): Card | null {
    const stride = (5 * x) + y
    const card = this.grid.at(stride)?.pop()
    if (isNil(card)) {
      return null
    }

    card.update({
      gridX: null,
      gridY: null
    })

    return card
  }

  public clear(gridX: number, gridY: number): boolean {
    const stride = (5 * gridX) + gridY

    const cardStack = this.grid.at(stride)
    if (isNil(cardStack)) {
      throw new Error('Could not clear card stack in grid')
    }

    cardStack.clear()

    return true
  }

  public push(gridX: number, gridY: number, card: Card): boolean {
    const stride = (5 * gridX) + gridY
    card.update({
      gridX,
      gridY,
    })

    const cardStack = this.grid.at(stride)
    if (isNil(cardStack)) {
      throw new Error('Could place card in grid')
    }

    cardStack.push(card)

    return true
  }

  public attack(gridX: number, gridY: number): void {
    const getTriggerAndAttackersAndFaceCard = (x: number, y: number) => {
      const placementCoordinates = `${x}${y}`
      switch (placementCoordinates) {
        case '11':
          return [
            { trigger: this.peek(x, y), attackers: [this.peek(x+1, y), this.peek(x+2, y)], face: this.peek(4, 1) },
            { trigger: this.peek(x, y), attackers: [this.peek(x, y+1), this.peek(x, y+2)], face: this.peek(1, 4) },
          ]
        case '12':
          return [{ trigger: this.peek(x, y), attackers: [this.peek(x+1, y), this.peek(x+2, y)], face: this.peek(2, 4) }]
        case '13':
          return [
            { trigger: this.peek(x, y), attackers: [this.peek(x, y-1), this.peek(x, y-2)], face: this.peek(1, 0) },
            { trigger: this.peek(x, y), attackers: [this.peek(x+1, y), this.peek(x+2, y)], face: this.peek(4, 3) },
          ]
        case '21':
          return [{ trigger: this.peek(x, y), attackers: [this.peek(x, y+1), this.peek(x, y+2)], face: this.peek(2, 4) }]
        case '22':
          return [{ trigger: null, attackers: null, face: null }]
        case '23':
          return [{ trigger: this.peek(x, y), attackers: [this.peek(x, y-1), this.peek(x, y-2)], face: this.peek(2, 0) }]
        case '31':
          return [
            { trigger: this.peek(x, y), attackers: [this.peek(x-1, y), this.peek(x-2, y)], face: this.peek(0, 1) },
            { trigger: this.peek(x, y), attackers: [this.peek(x, y+1), this.peek(x, y+2)], face: this.peek(3, 4) },
          ]
        case '32':
          return [{ trigger: this.peek(x, y), attackers: [this.peek(x-1, y), this.peek(x-2, y)], face: this.peek(0, 2) }]
        case '33':
          return [
            { trigger: this.peek(x, y), attackers: [this.peek(x-1, y), this.peek(x-2, y)], face: this.peek(0, 3) },
            { trigger: this.peek(x, y), attackers: [this.peek(x, y-1), this.peek(x, y-2)], face: this.peek(3, 0) },
          ]
        default:
          return [{ trigger: null, attackers: null, face: null }]
      }
    }

    // the (x, y) value is the coordinate of the spot card the player is placing
    const attackInfo = getTriggerAndAttackersAndFaceCard(gridX, gridY)

    for (const { trigger, attackers, face } of attackInfo) {
      if (isNil(trigger) || isNil(attackers) || isNil(face)) {
        continue
      }

      const attacker1 = attackers.at(0)
      const attacker2 = attackers.at(1)
      if (isNil(attacker1) || isNil(attacker2)) {
        continue
      }

      const hitValue = attacker1.Value + attacker2.Value

      const isFaceKing = face.Value === 13
      const isFaceQueen = face.Value === 12
      const isFaceJack = face.Value === 11

      const isKingDead = isFaceKing && hitValue >= face.Value && attacker1.Suit === face.Suit && attacker2.Suit === face.Suit
      const isQueenDead = isFaceQueen && hitValue >= face.Value && attacker1.Color === face.Color && attacker2.Color === face.Color
      const isJackDead = isFaceJack && hitValue >= face.Value
      if (isKingDead || isQueenDead || isJackDead) {
        const [x, y] = face.GridPosition
        if (isNil(x) || isNil(y)) {
          throw new Error('Could not find royal card in grid while attacking')
        }

        const attackedRoyal = this.peek(x, y)
        if (!isNil(attackedRoyal)) {
          attackedRoyal.kill()
        }
      }
    }
  }

  public findValidGridPlacements(selectedCard: Card): string[] {
    const orderByMostSimilarCard = (faceCard: Card) => {
      const byValueDiff = (a: Card, b: Card) => b.Value - a.Value
      const isSameSuit = (card: Card) => card.Suit === faceCard.Suit
      const isSameColor = (card: Card) => card.Color === faceCard.Color
      const difference = (a: Card[], b: Card[]) => {
        let sa = new Set([...a])
        let sb = new Set([...b])

        const resultA = a.filter((entry) => !sb.has(entry))
        const resultB = b.filter((entry) => !sa.has(entry))
        return [...resultA, ...resultB]
      }

      const playedCards = this.startNumberPositions
        .map(([x, y]) => this.peek(x,y))
        .filter((card: Card | null) => !isNil(card))
      const orderBySuitAndValue = [...playedCards].filter(isSameSuit).sort(byValueDiff)
      const orderByColorAndValue = [...playedCards].filter(isSameColor).sort(byValueDiff)
      const orderByValue = [...playedCards].sort(byValueDiff)

      return [
        ...orderBySuitAndValue,
        ...difference(orderBySuitAndValue, orderByColorAndValue),
        ...difference(orderByColorAndValue, orderByValue),
      ]
    }

    const getAdjacentFaceTiles = (x: number | null, y: number | null): number[][] | null => {
      if (isNil(x) || isNil(y)) {
        return null
      }

      const coordinate = `${x}${y}`
      switch (coordinate) {
        case '11':
          return [[0,1], [1,0]]
        case '12':
          return [[0,2]]
        case '13':
          return [[0,3], [1,4]]
        case '21':
          return [[2,0]]
        case '23':
          return [[2,4]]
        case '31':
          return [[3,0], [4,1]]
        case '32':
          return [[4,2]]
        case '33':
          return [[4,3], [3,4]]
        default:
          return null
      }
    }

    if (selectedCard.IsFace) {
      const mostSimilarCards = orderByMostSimilarCard(selectedCard)
      const faceTiles = mostSimilarCards
        .flatMap((card: Card) => getAdjacentFaceTiles(card.GridX, card.GridY))
        .filter((coordinate: number[] | null) => !isNil(coordinate))
        .filter((coordinate: number[]) => {
          const [x,y] = coordinate
          const isFaceCardPositionEmpty = isNil(this.peek(x, y))
          return isFaceCardPositionEmpty
        })
        .map((coordinates: number[]) => coordinates.join(''))
      return faceTiles
    } else if (selectedCard.IsJoker || selectedCard.IsAce) {
      return [...this.numberedPositions].map(coordinates => coordinates.join(''))
    } else {
      return [...this.numberedPositions]
        .filter(([x, y]) => {
          const card = this.peek(x, y)
          const isEmptyStack = isNil(card)
          const isLessThanSelectedCard = !isNil(card) && card.Value < selectedCard.Value

          return isEmptyStack || isLessThanSelectedCard
        })
        .map(coordinates => coordinates.join(''))
    }
  }

  // render() {
  //   const htmlGrid = this.htmlGrid

  //   for (let i = 0; i < this._grid.length; i++) {
  //     const card = this._grid[i].peek()
  //     const cardDiv = htmlGrid[i]
  //     const x = parseInt(cardDiv.getAttribute('data-grid-x'))
  //     const y = parseInt(cardDiv.getAttribute('data-grid-y'))

  //     if (window.game.gameState.selectedCardValidPlacementPositions?.has(`${x}${y}`)) {
  //       cardDiv.classList.add('selected')
  //     } else {
  //       cardDiv.classList.remove('selected')
  //     }

  //     if (!card) {
  //       cardDiv.classList.add('empty')
  //       cardDiv.innerHTML = '&nbsp;'
  //       continue
  //     }

  //     card.render(cardDiv)
  //   }
  // }

  public render(): void {
    // TODO:
  }

  /**
   * A way to print out state of grid while debugging
   */
  printAsTable() {
    const cardAbbreviations = this.grid.map(stack => {
      let abrv = 'XX'
      if (isNil(stack)) {
        return abrv
      }
      const card = stack.peek()
      if (isNil(card)) {
        return abrv
      }

      return card.Abbreviation
    })

    for (let i = 0; i < 5; i++) {
      console.log([
        cardAbbreviations.shift(),
        cardAbbreviations.shift(),
        cardAbbreviations.shift(),
        cardAbbreviations.shift(),
        cardAbbreviations.shift(),
      ])
    }
  }
}
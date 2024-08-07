import { css } from 'lit'
import * as device from '@/lib/device'

export const Card = css`
  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    transition: border .1s;
    border: 4px solid black;
    border-radius: 1rem;

    cursor: pointer;
    user-select: none;

    font-size: 1.5rem;
    box-sizing: border-box;

    min-width: 50px;
    height: 100%;
  }

  .card[data-suit="NULL"] {
    color: purple;
  }

  .card[data-suit="DIAMOND"], .card[data-suit="HEART"] {
    color: red;
  }

  .card[data-suit="CLUB"], .card[data-suit="SPADE"] {
    color: black;
  }

  .card[data-is-dead="true"], .card[data-is-face-showing="false"] {
    padding: .25rem;
    background: radial-gradient(circle closest-side, blue, purple);
    color: yellow;
  }

  .card[data-is-hand-card="false"][data-is-hidden="false"][data-is-empty="true"] {
    padding: .25rem;
    color: white;
    /* this border is to keep the cards the same width and height with crads that have a border*/
    border: 4px solid #005900;
    background-color: #005900;
  }

  /* need this to do so highlight orange works on empty grid positions */
  .card[data-is-hand-card="false"][data-is-hidden="false"][data-is-empty="true"][data-is-highlighted="true"] {
    padding: .25rem;
    color: white;
    border: 4px solid orange;
    background-color: #005900;
  }

  .card[data-is-highlighted="true"] {
    border: 4px solid orange;
  }

  .card[data-is-hand-card="true"][data-is-empty="true"] {
    border: 2px dotted white;
    background-color: #005900;
    color: white;
    padding: .25rem;
  }

  .card[data-is-empty="false"] {
    padding: .35rem;
    background-color: white;
  }

  .card[data-is-hidden="true"] {
    background: none;
    border: none;
  }

  @media screen and (max-width: ${device.PHONE_WIDTH_CSS}) {
    .card {
      min-width: 10px;
      font-size: 1.25rem;
    }
  }
`

export const CardArmor = css`
  .card-armor {
    height: 10%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
`

export const CardText = css`
  .card-text {
    height: 70%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex: 1;
    font-size: 1.25rem;
  }

  @media screen and (max-width: ${device.PHONE_WIDTH_CSS}) {
    .card-text {
      font-size: 1.25rem;
    }
  }
`

export const CardStat = css`
  .card-stat {
    height: 15%;
    color: black;
    font-size: 1rem;
    font-family: arial;
  }

  .card-stat[data-is-face-showing="false"] {
    color: yellow;
  }

  @media screen and (max-width: ${device.PHONE_WIDTH_CSS}) {
    .card-stat{
      font-size: .85rem;
    }
  }
`

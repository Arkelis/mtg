export interface CardInstance {
  cardID: number;
  tapped: boolean;
}

export interface State {
  library: number[];
  hand: number[];
  battleField: CardInstance[];
  graveyard: number[];
  manaPool: Mana;
  opponentLife: number;
}

export interface Card {
  name: string;
  type: string;
  illustration?: string;
  effect?: (state: State) => State;
  manaCost: Mana;
}

export interface Mana {
  red: number;
  blue: number;
  white: number;
  black: number;
  green: number;
}

export const Deck: Record<number, Card> = {
  0: {
    name: "mountain",
    illustration:
      "https://cards.scryfall.io/large/front/d/3/d3740beb-7fa5-4b83-be7d-039750b126c5.jpg?1695483576",
    effect: (state) => {
      state.manaPool.red += 1;
      return state;
    },
    type: "land",
    manaCost: { red: 0, blue: 0, white: 0, black: 0, green: 0 },
  },
  1: {
    name: "mountain",
    illustration:
      "https://cards.scryfall.io/large/front/d/3/d3740beb-7fa5-4b83-be7d-039750b126c5.jpg?1695483576",
    effect: (state) => {
      state.manaPool.red += 1;
      return state;
    },
    type: "land",
    manaCost: { red: 0, blue: 0, white: 0, black: 0, green: 0 },
  },
  2: {
    name: "lightning bolt",
    illustration:
      "https://cards.scryfall.io/normal/front/4/e/4eaac4fd-95f5-4f38-b593-0101e79a20f9.jpg?1623945607",
    manaCost: { red: 1, blue: 0, white: 0, black: 0, green: 0 },
    type: "instant",
    effect: (state) => {
      state.opponentLife -= 3;
      return state;
    },
  },
  // Add a card that deal 2 damage to player
  3: {
    name: "shock",
    illustration:
      "https://cards.scryfall.io/normal/front/6/0/60eeb025-704c-4a82-90b2-f91202ae30d9.jpg?1623945691",
    manaCost: { red: 1, blue: 0, white: 0, black: 0, green: 0 },
    type: "instant",
  },
};

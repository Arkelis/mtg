export interface CardInstance {
  cardID: number;
  tapped: boolean;
}

export interface State {
  library: number[];
  hand: number[];
  battleField: CardInstance[];
  manaPool: Mana;
}

export interface Card {
  name: string;
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
    name: "struc",
    illustration:
      "https://cards.scryfall.io/large/front/d/3/d3740beb-7fa5-4b83-be7d-039750b126c5.jpg?1695483576",
    effect: (state) => {
      state.manaPool.red += 1;
      return state;
    },
    manaCost: { red: 0, blue: 0, white: 0, black: 0, green: 0 },
  },
  1: {
    name: "struc",
    illustration:
      "https://cards.scryfall.io/large/front/d/3/d3740beb-7fa5-4b83-be7d-039750b126c5.jpg?1695483576",
    effect: (state) => {
      state.manaPool.red += 1;
      return state;
    },
    manaCost: { red: 0, blue: 0, white: 0, black: 0, green: 0 },
  },
};

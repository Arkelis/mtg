import { useReducer } from "react";
import classNames from "classnames";
import { Card, Deck, Mana, State } from "./card";

interface CardProp {
  card: Card;
  onClick: () => void;
  tapped: boolean;
}

const CardDisplay = ({ card, onClick, tapped }: CardProp) => (
  <img
    className={classNames(tapped ? "rotate-90" : "", "rounded-md")}
    onClick={onClick}
    width="240"
    src={card.illustration}
  />
);

type Event =
  | { type: "draw" }
  | { type: "play"; cardIndex: number }
  | { type: "tap"; cardIndex: number };

function checkManaCost(manaPool: Mana, card: Card) {
  Object.keys(card.manaCost).forEach((color) => {
    const manaColor = color as keyof Mana;
    if (card.manaCost[manaColor] > manaPool[manaColor]) {
      return false;
    }
  });
  return true;
}

function removeManaCost(manaPool: Mana, card: Card) {
  Object.keys(card.manaCost).forEach((color) => {
    const manaColor = color as keyof Mana;
    manaPool[manaColor] -= card.manaCost[manaColor];
  });
}

const reducer = (state: State, event: Event): State => {
  let newState = structuredClone(state);

  console.log(JSON.stringify(event));

  switch (event.type) {
    case "draw":
      newState.hand.push(newState.library[0]);
      newState.library.pop();
      break;
    case "play": {
      // TODO: Check cost
      const card = Deck[newState.hand[event.cardIndex]];
      if (checkManaCost(newState.manaPool, card)) {
        newState.battleField.push({ cardID: event.cardIndex, tapped: false });
        newState.hand.splice(event.cardIndex, 1);
        removeManaCost(newState.manaPool, card);
      }
      break;
    }
    case "tap": {
      if (!state.battleField[event.cardIndex].tapped) {
        const cardInstance = newState.battleField[event.cardIndex];
        cardInstance.tapped = true;

        const card = Deck[newState.battleField[event.cardIndex].cardID];
        console.log(card);
        newState = card.effect?.(newState) ?? newState;
      }
      break;
    }
  }

  return newState;
};

const emptyState = (): State => {
  return {
    library: [0, 1],
    hand: [],
    battleField: [],
    manaPool: { red: 0, blue: 0, white: 0, black: 0, green: 0 },
  };
};

function App() {
  const [state, dispatch] = useReducer(reducer, emptyState());

  return (
    <div className="m-16">
      <h1>Magic</h1>

      <div>
        <h2>Player 1</h2>
        <div>Number of cards in hands: {state.hand?.length}</div>
        <div>ManaPool: {JSON.stringify(state.manaPool)}</div>
        <div>Library</div>
        {state.library.length > 0 && (
          <CardDisplay
            onClick={() => dispatch({ type: "draw" })}
            card={{
              name: "back",
              illustration:
                "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcf.geekdo-images.com%2FCxJmNl4wR4InjqyNrMdBTw__imagepage%2Fimg%2FG185gILyaxGCYka6LwuEhd9--WA%3D%2Ffit-in%2F900x600%2Ffilters%3Ano_upscale()%3Astrip_icc()%2Fpic163749.jpg&f=1&nofb=1&ipt=ef1d15b2acdf88fd24d6dda6143af6585d7b53461f7dc5004496cc960b6850ae&ipo=images",
              manaCost: { red: 0, blue: 0, white: 0, black: 0, green: 0 },
            }}
            tapped={false}
          />
        )}
        <div>Hand</div>
        {state.hand.map((cardId, index) => (
          <CardDisplay
            onClick={() => dispatch({ type: "play", cardIndex: index })}
            key={index}
            card={Deck[cardId]}
            tapped={false}
          />
        ))}
      </div>
      <div>
        <h2>Battlefield</h2>
        {state.battleField.map((cardInstance, index) => (
          <CardDisplay
            onClick={() => dispatch({ type: "tap", cardIndex: index })}
            key={index}
            card={Deck[cardInstance.cardID]}
            tapped={cardInstance.tapped}
          />
        ))}
      </div>
    </div>
  );
}

export default App;

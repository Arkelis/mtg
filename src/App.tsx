import { useReducer } from "react";
import classNames from "classnames";
import { Card, Deck, Mana, State } from "./card";

interface CardProp {
  card: Card;
  onClick: () => void;
  tapped: boolean;
  isPlayable: boolean;
}

const CardDisplay = ({ card, onClick, tapped, isPlayable }: CardProp) => (
  <img
    className={classNames(
      isPlayable ? "shadow-lg shadow-green-400" : "",
      tapped ? "rotate-90" : "",
      "rounded-md transition duration-300",
    )}
    onClick={onClick}
    width="240"
    src={card.illustration}
  />
);

type Event =
  | { type: "draw" }
  | { type: "pass" }
  | { type: "play"; cardIndex: number }
  | { type: "tap"; cardIndex: number };

function checkManaCost(manaPool: Mana, card: Card) {
  return Object.entries(card.manaCost).every(([color, value]) => {
    const manaColor = color as keyof Mana;
    return value <= manaPool[manaColor];
  });
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
    case "pass":
      newState.battleField.forEach((card) => {
        card.tapped = false;
      });
      newState.manaPool = emptyManaPool();
      newState.turnNumber += 1;
      break;
    case "draw":
      newState.hand.push(newState.library[0]);
      newState.library.splice(0, 1);
      break;
    case "play": {
      const cardId = newState.hand[event.cardIndex];
      const card = Deck[cardId];
      if (checkManaCost(newState.manaPool, card)) {
        switch (card.type) {
          case "land":
            newState.battleField.push({ cardID: cardId, tapped: false });
            break;
          case "instant":
            newState.graveyard.push(cardId);
            newState = card.effect?.(newState) ?? newState;
            break;
        }
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
        newState = card.effect?.(newState) ?? newState;
      }
      break;
    }
  }

  return newState;
};

const emptyState = (): State => {
  return {
    library: [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    hand: [],
    battleField: [],
    graveyard: [],
    manaPool: emptyManaPool(),
    opponentLife: 20,
    turnNumber: 1,
  };
};

const emptyManaPool = (): Mana => {
  return { red: 0, blue: 0, white: 0, black: 0, green: 0 };
};

function App() {
  const [state, dispatch] = useReducer(reducer, emptyState());

  if (state.opponentLife <= 0) {
    return <div>You win</div>;
  }

  return (
    <div className="m-16">
      <h1>Magic</h1>
      <button onClick={() => dispatch({ type: "pass" })}>End of turn</button>

      <div>
        <h2>Player 1</h2>
        <div>Number of cards in hands: {state.hand?.length}</div>
        <div>Opponent Life: {state.opponentLife}</div>
        <div>Turn number: {state.turnNumber}</div>

        <div>Hand: {JSON.stringify(state.hand)}</div>
        <div>ManaPool: {JSON.stringify(state.manaPool)}</div>
        <div>Graveyard: {state.graveyard.length}</div>
        <div>Library</div>
        {state.library.length > 0 && (
          <CardDisplay
            onClick={() => dispatch({ type: "draw" })}
            card={{
              name: "back",
              illustration:
                "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcf.geekdo-images.com%2FCxJmNl4wR4InjqyNrMdBTw__imagepage%2Fimg%2FG185gILyaxGCYka6LwuEhd9--WA%3D%2Ffit-in%2F900x600%2Ffilters%3Ano_upscale()%3Astrip_icc()%2Fpic163749.jpg&f=1&nofb=1&ipt=ef1d15b2acdf88fd24d6dda6143af6585d7b53461f7dc5004496cc960b6850ae&ipo=images",
              manaCost: emptyManaPool(),
              type: "back",
            }}
            tapped={false}
            isPlayable={false}
          />
        )}
        <div>Hand</div>
        <div className="flex gap-8 bg-blue-400 min-h-[240px]">
          {state.hand.map((cardId, index) => {
            const card = Deck[cardId];

            return (
              <CardDisplay
                onClick={() => dispatch({ type: "play", cardIndex: index })}
                key={index}
                card={card}
                tapped={false}
                isPlayable={checkManaCost(state.manaPool, card)}
              />
            );
          })}
        </div>
      </div>
      <div>
        <h2>Battlefield</h2>

        <div className="flex gap-8 bg-blue-400 min-h-[240px]">
          {state.battleField.map((cardInstance, index) => {
            const card = Deck[cardInstance.cardID];

            return (
              <CardDisplay
                onClick={() => dispatch({ type: "tap", cardIndex: index })}
                key={index}
                card={card}
                tapped={cardInstance.tapped}
                isPlayable={false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;

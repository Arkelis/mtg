import { useReducer } from "react";

interface Card {
  name: string;
  illustration?: string;
}

interface State {
  library: Card[];
  hand: Card[];
}

type Event = "draw";

const reducer = (state: State, event: Event): State => {
  const newState = structuredClone(state);

  switch (event) {
    case "draw": {
      newState.hand.push(newState.library[0]);
      newState.library.pop();
      return newState;
    }
  }
};

const emptyState = (): State => {
  return {
    library: [
      {
        name: "struc",
        illustration:
          "https://cards.scryfall.io/large/front/d/3/d3740beb-7fa5-4b83-be7d-039750b126c5.jpg?1695483576",
      },
    ],
    hand: [],
  };
};

function App() {
  const [state, dispatch] = useReducer(reducer, emptyState());

  return (
    <>
      <h1>Magic</h1>

      <div>
        <h2>Player 1</h2>
        <div>Number of cards in hands: {state.hand?.length}</div>
        <div>Library</div>
        {state.library.length > 0 && (
          <img
            onClick={() => dispatch("draw")}
            width="240"
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcf.geekdo-images.com%2FCxJmNl4wR4InjqyNrMdBTw__imagepage%2Fimg%2FG185gILyaxGCYka6LwuEhd9--WA%3D%2Ffit-in%2F900x600%2Ffilters%3Ano_upscale()%3Astrip_icc()%2Fpic163749.jpg&f=1&nofb=1&ipt=ef1d15b2acdf88fd24d6dda6143af6585d7b53461f7dc5004496cc960b6850ae&ipo=images"
          />
        )}

        <div>Hand</div>
        {state.hand.map((card, index) => (
          <img key={index} width="240" src={card.illustration} />
        ))}
      </div>
      <div>
        <h2>Battlefield</h2>
      </div>
      {/*<div>*/}
      {/*  <h2>Player 2</h2>*/}
      {/*  <div>Library</div>*/}
      {/*  <div>Hand</div>*/}
      {/*</div>*/}
    </>
  );
}

export default App;
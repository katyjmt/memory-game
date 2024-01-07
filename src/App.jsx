import { useState, useEffect } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";

const cardImages = [
  { src: "/img/bird-01.png", matched: false },
  { src: "/img/bird-02.png", matched: false },
  { src: "/img/bird-03.png", matched: false },
  { src: "/img/bird-04.png", matched: false },
  { src: "/img/bird-05.png", matched: false },
  { src: "/img/bird-06.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);

  // Shuffle Cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.floor(Math.random() * 100000000) }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
  };

  // Handle User Choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    // Cannot compare choices in here as they may not have evaluated by the time this has run
    // Need to use useEffect, as this evaluates on-load and each time a dependency changes
  };

  // Compare Selected Cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        // Switch cards to back class
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  console.log(cards);
  console.log(choiceOne);
  console.log(choiceTwo);

  // Reset choices and increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  // Start new game
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="App">
      <h1>Memory Game</h1>
      <p>Flip the cards to find all the matching birds in the fewest number of turns.</p>
      <p>Turns: <strong>{turns}</strong></p>
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard 
          key={card.id} 
          card={card} 
          handleChoice={handleChoice} 
          flipped={ card === choiceOne || card === choiceTwo || card.matched }
          disabled={disabled}
          />
        ))}
      </div>
      <button onClick={shuffleCards}>New Game</button>
    </div>
  );
}

export default App;

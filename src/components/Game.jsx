import { useEffect, useState, lazy, Suspense } from "react";
import Card from "./Card";

const Modal = lazy(() => import("./modal"));

const cardsarr = [
  { src: "/images/php.svg", paired: false },
  { src: "/images/c.svg", paired: false },
  { src: "/images/html.svg", paired: false },
  { src: "/images/java.svg", paired: false },
  { src: "/images/python.svg", paired: false },
  { src: "/images/ruby.svg", paired: false },
  { src: "/images/swift.svg", paired: false },
  { src: "/images/typescript.svg", paired: false },
  { src: "/images/cpp3.svg", paired: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [score, setScore] = useState(0);

  const reOrderCards = () => {
    const newarr = isMobile ? cardsarr.slice(0, 6) : cardsarr;
    const arr = [...newarr, ...newarr]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
    setCards(arr);
    setMoves(0);
    setIsModal(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      reOrderCards();
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  useEffect(() => {
    reOrderCards();
    setMoves(0);
  }, []);

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        console.log("match");
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, paired: true };
            } else {
              return card;
            }
          });
        });
      } else {
        console.log("no match");
      }
      setTimeout(() => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setMoves((prev) => prev + 1);
        setDisabled(false);
      }, 1000);
    }
  }, [choiceOne, choiceTwo]);

  const maxScore = 1000;
  const penalty = 10;

  useEffect(() => {
    if (cards.length && cards.every((card) => card.paired)) {
      const finalScore = Math.max(0, maxScore - moves * penalty);
      setScore(finalScore);
      setIsModal(true);
    }
  }, [cards]);

  return (
    <div className="flex flex-col justify-center items-center font-atheletic">
      <div className="text-center font-bold md:text-5xl text-4xl md:py-11 py-8 relative">
        <img
          src="/images/bleu_lego_title.svg"
          alt="lego"
          className="md:w-6 md:h-7 w-4 h-5 object-conatain absolute md:top-4 md:-left-6 top-6 -left-3"
        />
        MEMORY CARD GAME
        <img
          src="/images/yellow-lego-title.svg"
          alt="lego"
          className="md:w-12 md:h-14 w-8 h-9 object-conatain absolute md:bottom-2 md:-right-8 bottom-3 -right-5"
        />
      </div>
      {isMobile && (
        <div className="flex flex-row gap-16 pb-4">
          {}
          <button
            className="flex flex-row gap-1 text-etic-bleu font-atheletic text-2xl"
            onClick={reOrderCards}
          >
            <img
              src="/images/replay.svg"
              alt="replay icon"
              className="w-7 h-7 object-contain"
            />
            <p>Replay</p>
          </button>
          <p className=" text-etic-bleu  text-2xl">Moves: {moves}</p>
        </div>
      )}

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 ">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card.paired || card === choiceOne || card === choiceTwo}
            disabled={
              disabled ||
              card.paired ||
              card === choiceOne ||
              card === choiceTwo
            }
          />
        ))}
      </div>
      {!isMobile && (
        <div className="flex flex-row gap-20 py-7">
          <button
            className="flex flex-row gap-1 text-etic-bleu font-atheletic text-3xl"
            onClick={reOrderCards}
          >
            <img
              src="/images/replay.svg"
              alt="replay icon"
              className="w-9 h-9 object-contain"
            />
            <p>Replay</p>
          </button>
          <p className=" text-etic-bleu  text-3xl">Moves: {moves}</p>
        </div>
      )}

      {isModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <Modal score={score} onReplay={reOrderCards} />
        </Suspense>
      )}
    </div>
  );
}

export default App;

import SnakeGame from "./snake";

import "./style.css";

const playBtn = document.querySelector(".play-btn") as HTMLButtonElement;
const scoreCard = (document.querySelector(".score-board") as HTMLDivElement)
  .lastElementChild as HTMLSpanElement;

const handleStart = () => {
  playBtn.classList.add("hide");
  SnakeGame.start();
};

const handleScoreChange = (score: number) => {
  scoreCard.textContent = score.toString();
};

const handleGameOver = () => {
  console.log("game-over");
};

playBtn.addEventListener("click", handleStart);
SnakeGame.addEventListener("score-change", handleScoreChange);
SnakeGame.addEventListener("game-over", handleGameOver);

SnakeGame.init("#app");

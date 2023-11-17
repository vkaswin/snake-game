import SnakeGame from "./snake";

import "./style.css";

const playBtn = document.querySelector(".play-btn") as HTMLButtonElement;
const scoreCard = (document.querySelector(".score-board") as HTMLDivElement)
  .lastElementChild as HTMLSpanElement;
const gameOver = document.querySelector(".game-over") as HTMLDivElement;
const restartBtn = gameOver.lastElementChild as HTMLButtonElement;

const handleStart = () => {
  playBtn.classList.add("hide");
  SnakeGame.start();
};

const handleRestart = () => {
  gameOver.classList.add("hide");
  scoreCard.textContent = "0";
  SnakeGame.restart();
};

const handleScoreChange = (score: number) => {
  scoreCard.textContent = score.toString();
};

const handleGameOver = () => {
  gameOver.classList.remove("hide");
};

playBtn.addEventListener("click", handleStart);
restartBtn.addEventListener("click", handleRestart);
SnakeGame.addEventListener("score-change", handleScoreChange);
SnakeGame.addEventListener("game-over", handleGameOver);

SnakeGame.init("#app");

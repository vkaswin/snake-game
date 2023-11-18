import EventEmitter from "./eventEmitter";

const getStaticPath = (path: string): string => {
  return `${import.meta.env.BASE_URL}${path}`;
};

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;
const size = 35;
const offset = size * 2;
const totalRows = Math.floor((innerWidth - offset) / size);
const totalColumns = Math.floor((innerHeight - offset) / size);
let midX = Math.floor(totalRows / 2);
let midY = Math.floor(totalColumns / 2);
const darkBg = "#8ECC39";
const lightBg = "#A8D948";
const assests = [
  "apple",
  "bodyVertical",
  "bodyHorizontal",
  "bodyBottomLeft",
  "bodyBottomRight",
  "bodyTopLeft",
  "bodyTopRight",
  "headDown",
  "headLeft",
  "headUp",
  "headRight",
  "tailDown",
  "tailLeft",
  "tailUp",
  "tailRight",
] as const;
const images = {} as IGameAssets;
const eventEmiter = new EventEmitter();
const foodSound = new Audio(getStaticPath("crunch.wav"));
const gameOverSound = new Audio(getStaticPath("gameOver.mp3"));
const initialDirection: IDirection = "right";

let snakeDirection: IDirection = initialDirection;
let intervalId: ReturnType<typeof setInterval> | null = null;
let appleRect = {} as IApple;
let gameSpeed = 100;
let score = 0;
let initialSnake: ISnake[] = [
  {
    x: midX,
    y: midY,
    direction: initialDirection,
  },
  {
    x: midX - 1,
    y: midY,
    direction: initialDirection,
  },
  {
    x: midX - 2,
    y: midY,
    direction: initialDirection,
  },
];

let snake: ISnake[] = [...initialSnake];

const loadImage = (name: string, img: HTMLImageElement) => {
  return new Promise((resolve, reject) => {
    img.src = getStaticPath(`${name}.png`);
    img.onload = resolve;
    img.onerror = reject;
  });
};

const loadAssets = () => {
  return Promise.all(
    assests.map((name) => {
      images[name] = new Image();
      return loadImage(name, images[name]);
    })
  );
};

const moveSnake = () => {
  let { x, y } = snake[0];

  if (appleRect.x === x && appleRect.y === y) {
    foodSound.play();
    eventEmiter.emit("score-change", ++score);
    appleRect = getAppleRect();
  } else {
    snake.pop();
  }

  if (snakeDirection === "right") x++;
  else if (snakeDirection === "left") x--;
  else if (snakeDirection === "top") y--;
  else if (snakeDirection === "bottom") y++;

  if (x >= totalRows) x = 0;
  else if (x < 0) x = totalRows - 1;
  else if (y < 0) y = totalColumns - 1;
  else if (y >= totalColumns) y = 0;

  snake[0].direction = snakeDirection;
  snake.unshift({ x, y, direction: snakeDirection });
};

const render = () => {
  if (checkCollision()) return handleGameOver();
  moveSnake();
  clearBoard();
  drawBackGround();
  drawApple();
  drawSnake();
};

const handleGameOver = () => {
  if (!intervalId) return;
  gameOverSound.play();
  clearInterval(intervalId);
  intervalId = null;
  eventEmiter.emit("game-over");
};

const checkCollision = () => {
  let { x, y } = snake[0];

  return snake.some((body, index) => {
    if (index === 0) return false;
    return body.x === x && body.y === y;
  });
};

const clearBoard = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawBackGround = () => {
  ctx.save();

  for (let i = 0; i < totalRows; i++) {
    let color = i % 2 === 0 ? darkBg : lightBg;
    for (let j = 0; j < totalColumns; j++) {
      ctx.fillStyle = color;
      ctx.fillRect(i * size, j * size, size, size);
      ctx.fill();
      color = color === darkBg ? lightBg : darkBg;
    }
  }

  ctx.restore();
};

const getAppleRect = (): IApple => {
  let x = Math.floor(Math.random() * totalRows);
  let y = Math.floor(Math.random() * totalColumns);
  let isInSake = snake.some((body) => body.x === x && body.y === y);
  return isInSake ? getAppleRect() : { x, y };
};

const drawApple = () => {
  ctx.drawImage(
    images.apple,
    appleRect.x * size,
    appleRect.y * size,
    size,
    size
  );
};

const drawSnake = () => {
  for (let i = snake.length - 1; i >= 0; i--) {
    if (i === 0) drawSnakeHead();
    else if (i === snake.length - 1) drawSnakeTail();
    else drawSnakeBody(i);
  }
};

const drawSnakeHead = () => {
  let head;
  let { x, y, direction } = snake[0];

  if (direction === "top") {
    head = images.headUp;
  } else if (direction === "bottom") {
    head = images.headDown;
  } else if (direction === "right") {
    head = images.headRight;
  } else if (direction === "left") {
    head = images.headLeft;
  }

  if (!head) return;

  ctx.drawImage(head, x * size, y * size, size, size);
};

const drawSnakeTail = () => {
  let tail;
  let { x, y, direction } = snake[snake.length - 1];

  if (direction === "top") {
    tail = images.tailDown;
  } else if (direction === "bottom") {
    tail = images.tailUp;
  } else if (direction === "right") {
    tail = images.tailLeft;
  } else if (direction === "left") {
    tail = images.tailRight;
  }

  if (!tail) return;

  ctx.drawImage(tail, x * size, y * size, size, size);
};

const drawSnakeBody = (index: number) => {
  let body;
  let { x, y, direction } = snake[index];

  let next = snake[index - 1]; // towards head
  let prev = snake[index + 1]; // towards tail

  if (prev.x === x && next.x === x) {
    body = images.bodyVertical;
  } else if (prev.y === y && next.y === y) {
    body = images.bodyHorizontal;
  } else if (
    (prev.direction === "right" && direction === "top") ||
    (prev.direction === "bottom" && direction === "left")
  ) {
    body = images.bodyTopLeft;
  } else if (
    (prev.direction === "left" && direction === "bottom") ||
    (prev.direction === "top" && direction === "right")
  ) {
    body = images.bodyBottomRight;
  } else if (
    (prev.direction === "bottom" && direction === "right") ||
    (prev.direction === "left" && direction === "top")
  ) {
    body = images.bodyTopRight;
  } else if (
    (prev.direction === "right" && direction === "bottom") ||
    (prev.direction === "top" && direction === "left")
  ) {
    body = images.bodyBottomLeft;
  }

  if (!body) return;

  ctx.drawImage(body, x * size, y * size, size, size);
};

const start = () => {
  intervalId = setInterval(render, gameSpeed);
};

const handleKeyDown = (event: KeyboardEvent) => {
  let direction = snake[0].direction;
  let isGoingLeft = direction === "left";
  let isGoingRight = direction === "right";
  let isGoingTop = direction === "top";
  let isGoingBottom = direction === "bottom";

  if (event.key === "ArrowLeft" && !isGoingRight) {
    snakeDirection = "left";
  } else if (event.key === "ArrowRight" && !isGoingLeft) {
    snakeDirection = "right";
  } else if (event.key === "ArrowUp" && !isGoingBottom) {
    snakeDirection = "top";
  } else if (event.key === "ArrowDown" && !isGoingTop) {
    snakeDirection = "bottom";
  }
};

const restart = () => {
  snake = [...initialSnake];
  snakeDirection = initialDirection;
  clearBoard();
  drawBackGround();
  drawSnake();
  drawApple();
  start();
};

const init = async (selector: string) => {
  let container = document.querySelector(selector);

  if (!container) return;

  window.addEventListener("keydown", handleKeyDown);

  await loadAssets();
  canvas.width = totalRows * size;
  canvas.height = totalColumns * size;
  appleRect = getAppleRect();
  container.append(canvas);
  drawBackGround();
  drawSnake();
  drawApple();
};

export default {
  init,
  start,
  restart,
  addEventListener: eventEmiter.addEventListener.bind(eventEmiter),
  removeEventListener: eventEmiter.removeEventListener.bind(eventEmiter),
};

import EventEmitter from "./eventEmitter";

const getStaticPath = (path: string): string => {
  return `${import.meta.env.BASE_URL}${path}`;
};

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;
const size = 35;
const totalRows = 35;
const totalColumns = 20;
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

let intervalId: ReturnType<typeof setInterval> | null = null;
let appleRect = {} as IApple;
let gameSpeed = 100;
let score = 0;
let snake: ISnake[] = [
  {
    x: 19,
    y: 10,
    direction: "right",
  },
  {
    x: 18,
    y: 10,
    direction: "right",
  },
  {
    x: 17,
    y: 10,
    direction: "right",
  },
];

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
  let { x, y, direction } = snake[0];

  if (appleRect.x === x && appleRect.y === y) {
    foodSound.play();
    eventEmiter.emit("score-change", ++score);
    appleRect = getAppleRect();
  } else {
    snake.pop();
  }

  if (direction === "right") x++;
  else if (direction === "left") x--;
  else if (direction === "top") y--;
  else if (direction === "bottom") y++;

  snake.unshift({ x, y, direction });
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
    if (i === 0) drawSnakeHead(i);
    else if (i === snake.length - 1) drawSnakeTail(i);
    else drawSnakeBody(i);
  }
};

const drawSnakeHead = (index: number) => {
  let head;
  let { x, y, direction } = snake[index];

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

  if (x >= totalRows) x = 0;
  else if (x < 0) x = totalRows;
  else if (y < 0) y = totalColumns;
  else if (y >= totalColumns) y = 0;

  snake[0].x = x;
  snake[0].y = y;

  x *= size;
  y *= size;

  ctx.drawImage(head, x, y, size, size);
};

const drawSnakeTail = (index: number) => {
  let tail;
  let { x, y, direction } = snake[index];

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

  if (direction === "top" || direction === "bottom") {
    if (event.key === "ArrowLeft") {
      snake[0].direction = "left";
    } else if (event.key === "ArrowRight") {
      snake[0].direction = "right";
    }
  } else if (direction === "left" || direction === "right") {
    if (event.key === "ArrowUp") {
      snake[0].direction = "top";
    } else if (event.key === "ArrowDown") {
      snake[0].direction = "bottom";
    }
  }
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
  addEventListener: eventEmiter.addEventListener.bind(eventEmiter),
  removeEventListener: eventEmiter.removeEventListener.bind(eventEmiter),
};

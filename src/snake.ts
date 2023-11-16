const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;
const backgroundColor = "#AAD751";
const size = 30;
const totalRows = 40;
const totalColumns = 20;
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

let intervalId: ReturnType<typeof setInterval> | null = null;
let appleRect: IApple = {
  x: 8,
  y: 5,
};
let gameSpeed = 100;
let snake: ISnake = [
  { x: 7, y: 5, direction: "right" },
  { x: 6, y: 5, direction: "right" },
  { x: 5, y: 5, direction: "right" },
];

const getStaticPath = (path: string): string => {
  return `${import.meta.env.BASE_URL}${path}`;
};

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
  snake.pop();
  let { x, y, direction } = snake[0];
  if (direction === "right") x++;
  else if (direction === "left") x--;
  else if (direction === "top") y--;
  else if (direction === "bottom") y++;
  snake.unshift({ x, y, direction });
};

const render = () => {
  moveSnake();
  clearCanvas();
  drawBackGround();
  drawSnake();
  drawApple();
};

const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawBackGround = () => {
  ctx.save();
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  ctx.restore();
};

const getAppleRect = () => {
  let x = Math.floor(Math.random() * totalRows);
  let y = Math.floor(Math.random() * totalColumns);

  return { x, y };
};

const drawApple = () => {
  if (!appleRect) appleRect = getAppleRect();

  ctx.drawImage(
    images.apple,
    appleRect.x * size,
    appleRect.y * size,
    size,
    size
  );
};

const drawSnake = () => {
  drawSnakeHead();
  drawSnakeBody();
  drawSnakeTail();
};

const drawSnakeHead = () => {
  let direction = snake[0].direction;
  let head: HTMLImageElement | null = null;

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

  let x = snake[0].x;
  let y = snake[0].y;

  if (x > totalRows) x = 0;
  else if (x < 0) x = totalRows;
  else if (y < 0) y = totalColumns;
  else if (y > totalColumns) y = 0;

  snake[0].x = x;
  snake[0].y = y;

  x *= size;
  y *= size;

  ctx.drawImage(head, x, y, size, size);
};

const drawSnakeTail = () => {
  let { x, y, direction } = snake[snake.length - 1];

  let tail: HTMLImageElement | null = null;

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

const drawSnakeBody = () => {
  for (let i = 1; i <= snake.length - 2; i++) {
    let { x, y, direction } = snake[i];
    ctx.drawImage(images.bodyHorizontal, x * size, y * size, size, size);
  }
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
  container.append(canvas);
  drawBackGround();
  drawSnake();
  drawApple();
};

export default { init, start };

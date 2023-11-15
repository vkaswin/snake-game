const SnakeGame = (() => {
  const fps = 60;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const backgroundColor = "#AAD751";
  const size = 40;
  const totalRows = 25;
  const totalColumns = 15;
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
  let appleRect: IApple = null;

  const getStaticPath = (path: string): string => {
    return `${import.meta.env.BASE_URL}${path}`;
  };

  const loadImage = (name: string, img: HTMLImageElement) => {
    return new Promise((resolve, reject) => {
      img.src = getStaticPath(`${name}.png`);

      img.onload = (event) => {
        resolve(event);
      };

      img.onerror = (reason) => {
        reject(reason);
      };
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

  const render = () => {
    clearCanvas();
    paintBackGround();
    paintApple();
  };

  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const paintBackGround = () => {
    ctx.save();
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.restore();
  };

  const getAppleRect = () => {
    let x = Math.floor(Math.random() * totalRows) * size;
    let y = Math.floor(Math.random() * totalColumns) * size;

    return { x, y };
  };

  const paintApple = () => {
    if (!appleRect) appleRect = getAppleRect();

    ctx.drawImage(images.apple, appleRect.x, appleRect.y);
  };

  const paintSnake = () => {};

  const paintSnakeTail = () => {};

  const paintSnakeHead = () => {};

  const paintSnakeBody = () => {};

  const start = () => {
    intervalId = setInterval(render, 1000 / fps);
  };

  const init = async (selector: string) => {
    let container = document.querySelector(selector);

    if (!container) return;

    await loadAssets();
    console.log(images);
    canvas.width = totalRows * size;
    canvas.height = totalColumns * size;
    container.append(canvas);
    render();
  };

  return { init, start };
})();

export default SnakeGame;

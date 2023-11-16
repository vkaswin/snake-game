type IApple = {
  x: number;
  y: number;
} | null;

type IGameAssets = Record<
  | "apple"
  | "bodyVertical"
  | "bodyHorizontal"
  | "bodyBottomLeft"
  | "bodyBottomRight"
  | "bodyTopLeft"
  | "bodyTopRight"
  | "headDown"
  | "headLeft"
  | "headUp"
  | "headRight"
  | "tailDown"
  | "tailLeft"
  | "tailUp"
  | "tailRight",
  HTMLImageElement
>;

type IDirection = "right" | "left" | "top" | "bottom";

type ISnake = {
  x: number;
  y: number;
  direction: IDirection;
}[];

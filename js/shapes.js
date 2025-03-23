import { ctx } from "./canvas.js";

export function drawLineDDA(x1, y1, x2, y2, ctx) {
  let dx = x2 - x1,
    dy = y2 - y1;
  let passos, xincr, yincr, x, y;

  x = x1;
  y = y1;
  if (Math.abs(dx) > Math.abs(dy)) {
    passos = Math.abs(dx);
  } else {
    passos = Math.abs(dy);
  }
  xincr = dx / passos;
  yincr = dy / passos;
  for (let i = 0; i < passos; i++) {
    x += xincr;
    y += yincr;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
}

export function drawLineBresenham(x1, y1, x2, y2, ctx) {
  let dx = x2 - x1,
    dy = y2 - y1;
  let p, c1, c2, xincr, yincr, x, y;

  x = x1;
  y = y1;

  ctx.fillRect(Math.round(x), Math.round(y), 1, 1);

  if (dx >= 0) {
    xincr = 1;
  } else {
    xincr = -1;
    dx = -dx;
  }

  if (dy >= 0) {
    yincr = 1;
  } else {
    yincr = -1;
    dy = -dy;
  }

  if (dx > dy) {
    p = 2 * dy - dx;
    c1 = 2 * dy;
    c2 = 2 * (dy - dx);

    for (let i = 0; i < dx; i++) {
      x += xincr;

      if (p < 0) {
        p += c1;
      } else {
        p += c2;
        y += yincr;
      }

      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
  } else {
    p = 2 * dx - dy;
    c1 = 2 * dx;
    c2 = 2 * (dx - dy);

    for (let i = 0; i < dy; i++) {
      y += yincr;

      if (p < 0) {
        p += c1;
      } else {
        p += c2;
        x += xincr;
      }
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
  }
}

export function drawCircle(xc, yc, x2, y2) {
  const r = calculateRadius(xc, yc, x2, y2);

  let x = 0,
    y = r,
    p = 3 - 2 * r;

  plotaSimetricos(x, y, xc, yc);

  while (x < y) {
    if (p < 0) {
      p += 4 * x + 6;
    } else {
      p += 4 * (x - y) + 10;
      y--;
    }
    x++;
    plotaSimetricos(x, y, xc, yc);
  }
}

export function calculateRadius(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function plotaSimetricos(a, b, xc, yc) {
  ctx.fillRect(Math.round(xc + a), Math.round(yc + b), 1, 1);
  ctx.fillRect(Math.round(xc + a), Math.round(yc - b), 1, 1);
  ctx.fillRect(Math.round(xc - a), Math.round(yc + b), 1, 1);
  ctx.fillRect(Math.round(xc - a), Math.round(yc - b), 1, 1);
  ctx.fillRect(Math.round(xc + b), Math.round(yc + a), 1, 1);
  ctx.fillRect(Math.round(xc + b), Math.round(yc - a), 1, 1);
  ctx.fillRect(Math.round(xc - b), Math.round(yc + a), 1, 1);
  ctx.fillRect(Math.round(xc - b), Math.round(yc - a), 1, 1);
}

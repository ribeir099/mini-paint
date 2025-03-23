import {
  drawLineDDA,
  drawLineBresenham,
  drawCircle,
  calculateRadius,
} from "./shapes.js";

export const canvas = document.getElementById("paintCanvas");
export const ctx = canvas.getContext("2d");

drawAxes();

export function drawAxes() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.strokeStyle = "gray";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();
}

export function redrawObjects(objects) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes();

  objects.forEach((obj) => {
    let { start, end, type, algorithm } = obj;
    if (type === "line") {
      switch (algorithm) {
        case "DDA":
          drawLineDDA(start.x, start.y, end.x, end.y, ctx);
          break;
        case "Bresenham":
          drawLineBresenham(start.x, start.y, end.x, end.y, ctx);
          break;
      }
    } else if (type === "circle") {
      drawCircle(start.x, start.y, end.x, end.y);
    }
  });
}

export function selectObject(x, y, objects) {
  const margin = 10;
  let selected = null;

  objects.forEach((obj) => {
    if (obj.type === "line") {
      let { start, end } = obj;
      let distance = pointToSegmentDistance(
        x,
        y,
        start.x,
        start.y,
        end.x,
        end.y
      );

      if (distance <= margin) {
        selected = obj;
      }
    } else if (obj.type === "circle") {
      let { start, end } = obj;
      let radius = calculateRadius(start.x, start.y, end.x, end.y);
      let distance = calculateRadius(start.x, start.y, x, y);

      if (Math.abs(distance - radius) <= margin) {
        selected = obj;
      }
    }
  });

  if (selected) {
    redrawObjects(objects);
  }

  return selected;
}

export function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
  let A = px - x1;
  let B = py - y1;
  let C = x2 - x1;
  let D = y2 - y1;

  let dot = A * C + B * D;
  let len_sq = C * C + D * D;
  let param = len_sq !== 0 ? dot / len_sq : -1;

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  return Math.sqrt((px - xx) ** 2 + (py - yy) ** 2);
}

export function createMiniCanvas(xmin, ymin, xmax, ymax, croppedObjects) {
  let aside = document.querySelector("aside");

  let width = xmax - xmin;
  let height = ymax - ymin;

  let miniCanvas = document.createElement("canvas");
  miniCanvas.width = width;
  miniCanvas.height = height;

  let miniCtx = miniCanvas.getContext("2d");
  aside.appendChild(miniCanvas);

  drawCroppedObjects(miniCtx, croppedObjects, xmin, ymin);
}

function drawCroppedObjects(ctx, objects, xmin, ymin) {
  objects.forEach((obj) => {
    let { start, end, type, algorithm } = obj;
    let x1 = start.x - xmin;
    let y1 = start.y - ymin;
    let x2 = end.x - xmin;
    let y2 = end.y - ymin;

    if (type === "line") {
      switch (algorithm) {
        case "DDA":
          drawLineDDA(x1, y1, x2, y2, ctx);
          break;
        case "Bresenham":
          drawLineBresenham(x1, y1, x2, y2, ctx);
          break;
      }
    }
  });
}

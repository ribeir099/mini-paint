import { createMiniCanvas } from "./canvas.js";

export function cropping(x1, y1, x2, y2, mode, objects) {
  const xmax = x1 > x2 ? x1 : x2;
  const xmin = x1 < x2 ? x1 : x2;
  const ymax = y1 > y2 ? y1 : y2;
  const ymin = y1 < y2 ? y1 : y2;

  let croppedObjects = [];

  objects.forEach((obj) => {
    let { start, end, type, algorithm } = obj;
    let newObject = null;

    if (mode === "CodedRegions") {
      newObject = cohen(start.x, start.y, end.x, end.y, xmin, ymin, xmax, ymax);
    } else if (mode === "ParametricEquation") {
      newObject = liang(start.x, start.y, end.x, end.y, xmin, ymin, xmax, ymax);
    }

    if (newObject) {
      croppedObjects.push({
        type: type,
        start: { x: newObject.xa, y: newObject.ya },
        end: { x: newObject.xb, y: newObject.yb },
        algorithm: algorithm,
      });
    }
  });

  if (croppedObjects.length !== 0) {
    createMiniCanvas(xmin, ymin, xmax, ymax, croppedObjects);
  }
}

function cohen(xa, ya, xb, yb, xmin, ymin, xmax, ymax) {
  let codA, codB, xint, yint, cod;
  let feito = false,
    aceite = false;

  while (!feito) {
    codA = obtemCodigo(xa, ya, xmin, ymin, xmax, ymax);
    codB = obtemCodigo(xb, yb, xmin, ymin, xmax, ymax);

    if (codA === 0 && codB === 0) {
      feito = true;
      aceite = true;
    } else if ((codA & codB) !== 0) {
      feito = true;
    } else {
      if (codA !== 0) {
        cod = codA;
      } else {
        cod = codB;
      }
      if (obtemBit(0, cod) === 1) {
        xint = xmin;
        yint = ya + ((yb - ya) * (xmin - xa)) / (xb - xa);
      } else if (obtemBit(1, cod) === 1) {
        xint = xmax;
        yint = ya + ((yb - ya) * (xmax - xa)) / (xb - xa);
      } else if (obtemBit(2, cod) === 1) {
        yint = ymin;
        xint = xa + ((xb - xa) * (ymin - ya)) / (yb - ya);
      } else if (obtemBit(3, cod) == 1) {
        yint = ymax;
        xint = xa + ((xb - xa) * (ymax - ya)) / (yb - ya);
      }
      if (cod === codA) {
        xa = xint;
        ya = yint;
      } else {
        xb = xint;
        yb = yint;
      }
    }
  }
  if (aceite) {
    return { xa, ya, xb, yb };
  } else {
    return null;
  }
}

function obtemCodigo(x, y, xmin, ymin, xmax, ymax) {
  let cod = 0;
  if (x < xmin) {
    cod++;
  }
  if (x > xmax) {
    cod += 2;
  }
  if (y < ymin) {
    cod += 4;
  }
  if (y > ymax) {
    cod += 8;
  }

  return cod;
}

function obtemBit(pos, numero) {
  return (numero >> pos) & 1;
}

function liang(x1, y1, x2, y2, xmin, ymin, xmax, ymax) {
  let dx = x2 - x1,
    dy = y2 - y1;
  const u = {
    u1: 0,
    u2: 1,
  };
  if (cliptest(-dx, x1 - xmin, u)) {
    if (cliptest(dx, xmax - x1, u)) {
      if (cliptest(-dy, y1 - ymin, u)) {
        if (cliptest(dy, ymax - y1, u)) {
          if (u.u2 < 1) {
            x2 = x1 + dx * u.u2;
            y2 = y1 + dy * u.u2;
          }
          if (u.u1 > 0) {
            x1 = x1 + dx * u.u1;
            y1 = y1 + dy * u.u1;
          }
          return { xa: x1, ya: y1, xb: x2, yb: y2 };
        }
      }
    }
  } else {
    return null;
  }
}

function cliptest(p, q, u) {
  let result = true;
  let r;
  if (p === 0 && q < 0) {
    result = false;
  } else if (p < 0) {
    r = q / p;
    if (r > u.u2) {
      result = false;
    } else if (r > u.u1) {
      u.u1 = r;
    }
  } else if (p > 0) {
    r = q / p;
    if (r < u.u1) {
      result = false;
    } else if (r > u.u2) {
      u.u2 = r;
    }
  }

  return result;
}

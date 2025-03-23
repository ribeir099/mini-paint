import { canvas, redrawObjects } from "./canvas.js";
// import { objects } from "./events.js";

export function scaleObject(object, objects) {
  if (!object) return;

  // if (object.type === "line") {
  //   object.start = scalePoint(object.start);
  //   object.end = scalePoint(object.end);
  // } else if (object.type === "circle") {
  //   object.start = scalePoint(object.start);
  //   object.end = scalePoint(object.end);
  // }

  object.start = scalePoint(object.start);
  object.end = scalePoint(object.end);

  redrawObjects(objects);
}

function scalePoint(point) {
  const inputs = document.querySelectorAll(
    ".input-transformations-coordinates_clicked input"
  );
  const sx = parseFloat(inputs[0].value) || 1;
  const sy = parseFloat(inputs[1].value) || 1;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  let x = point.x - centerX;
  let y = -(point.y - centerY);

  x *= sx;
  y *= sy;

  return { x: x + centerX, y: centerY - y };
}

export function rotationObject(object, objects) {
  if (!object) return;

  // if (object.type === "line") {
  //   object.start = rotatePoint(object.start);
  //   object.end = rotatePoint(object.end);
  // } else if (object.type === "circle") {
  //   object.start = rotatePoint(object.start);
  //   object.end = rotatePoint(object.end);
  // }

  object.start = rotatePoint(object.start);
  object.end = rotatePoint(object.end);

  redrawObjects(objects);
}

function rotatePoint(point) {
  const inputAngle = document.querySelector(
    ".input-transformations-angle_clicked input"
  );
  const angle = parseFloat(inputAngle.value) || 0;
  const radians = (angle * Math.PI) / 180;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  let x = point.x - centerX;
  let y = -(point.y - centerY);

  let newX = x * Math.cos(radians) - y * Math.sin(radians);
  let newY = x * Math.sin(radians) + y * Math.cos(radians);

  return { x: newX + centerX, y: centerY - newY };
}

export function reflectObject(object, objects) {
  if (!object) return;

  // if (object.type === "line") {
  //   object.start = reflectPoint(object.start);
  //   object.end = reflectPoint(object.end);
  // } else if (object.type === "circle") {
  //   object.start = reflectPoint(object.start);
  //   object.end = reflectPoint(object.end);
  // }

  object.start = reflectPoint(object.start);
  object.end = reflectPoint(object.end);

  redrawObjects(objects);
}

function reflectPoint(point) {
  const canvasCenterX = canvas.width / 2;
  const canvasCenterY = canvas.height / 2;

  const selectedAxisX = document.querySelector(
    'input[name="asis-x"]:checked'
  )?.value;
  const selectedAxisY = document.querySelector(
    'input[name="asis-y"]:checked'
  )?.value;

  let x = point.x - canvasCenterX;
  let y = -(point.y - canvasCenterY);

  if (selectedAxisX === "x" && selectedAxisY === "y") {
    y = -y;
    x = -x;
  } else if (selectedAxisX === "x") {
    y = -y;
  } else {
    x = -x;
  }

  return { x: x + canvasCenterX, y: canvasCenterY - y };
}

export function translationObject(object, objects) {
  if (!object) return;

  const inputs = document.querySelectorAll(
    ".input-transformations-coordinates_clicked input"
  );
  const tx = parseInt(inputs[0].value, 10) || 0;
  const ty = parseInt(inputs[1].value, 10) || 0;

  // if (object.type === "line") {
  //   object.start = translatePoint(object.start, tx, ty);
  //   object.end = translatePoint(object.end, tx, ty);
  // } else if (object.type === "circle") {
  //   object.start = translatePoint(object.start, tx, ty);
  //   object.end = translatePoint(object.end, tx, ty);
  // }

  object.start = translatePoint(object.start, tx, ty);
  object.end = translatePoint(object.end, tx, ty);
  redrawObjects(objects);
}

function translatePoint(point, tx, ty) {
  const canvasCenterX = canvas.width / 2;
  const canvasCenterY = canvas.height / 2;
  let x = point.x - canvasCenterX;
  let y = -(point.y - canvasCenterY);

  x += tx;
  y += ty;

  return { x: x + canvasCenterX, y: canvasCenterY - y };
}

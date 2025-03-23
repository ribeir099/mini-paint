import {
  reflectObject,
  translationObject,
  rotationObject,
  scaleObject,
} from "./transformations.js";
import { canvas, ctx, selectObject } from "./canvas.js";
import { drawLineDDA, drawLineBresenham, drawCircle } from "./shapes.js";
import { cropping } from "./cropping.js";

let objects = [];

let mode = "select";
let selectedObject = null;
let points = [];
let click = false;

const dda = document.getElementById("dda");
const bresenham = document.getElementById("bresenham");
const circle = document.getElementById("circle");
const reflection = document.getElementById("reflection");
const translation = document.getElementById("translation");
const rotation = document.getElementById("rotation");
const scale = document.getElementById("scale");
const codedRegions = document.getElementById("coded-regions");
const parametricEquation = document.getElementById("parametric-equation");

const asisContainer = document.querySelector(".input-transformations-asis");
const coordinatesContainer = document.querySelector(
  ".input-transformations-coordinates"
);
const angleContainer = document.querySelector(".input-transformations-angle");

dda.addEventListener("click", () => {
  setMode("DDA");
  toggleTextClass(dda);
  selectedObject = dda;
});

bresenham.addEventListener("click", () => {
  setMode("Bresenham");
  toggleTextClass(bresenham);
  selectedObject = bresenham;
});

circle.addEventListener("click", () => {
  setMode("Circle");
  toggleTextClass(circle);
  selectedObject = circle;
});

reflection.addEventListener("click", () => {
  setMode("Reflection");
  toggleTextClass(reflection);
  selectedObject = reflection;
  toggleTransformationsInput("Reflection");
});

translation.addEventListener("click", () => {
  setMode("Translation");
  toggleTextClass(translation);
  toggleTransformationsInput("Translation");
  selectedObject = translation;
});

rotation.addEventListener("click", () => {
  setMode("Rotation");
  toggleTextClass(rotation);
  toggleTransformationsInput("Rotation");
  selectedObject = rotation;
});

scale.addEventListener("click", () => {
  setMode("Scale");
  toggleTextClass(scale);
  toggleTransformationsInput("Scale");
  selectedObject = scale;
});

codedRegions.addEventListener("click", () => {
  setMode("CodedRegions");
  toggleTextClass(codedRegions);
  selectedObject = codedRegions;
});

parametricEquation.addEventListener("click", () => {
  setMode("ParametricEquation");
  toggleTextClass(parametricEquation);
  selectedObject = parametricEquation;
});

canvas.addEventListener("click", (e) => {
  let x = e.offsetX;
  let y = e.offsetY;
  points.push({ x, y });

  if (points.length === 1) {
    const object = selectObject(x, y, objects);
    handleSingleClick(object);
  } else if (points.length === 2) {
    handleDoubleClick(points[0], points[1]);
  }
});

function handleSingleClick(object) {
  switch (mode) {
    case "Reflection":
      reflectObject(object, objects);
      resetTransformations(mode);
      break;
    case "Translation":
      translationObject(object, objects);
      resetTransformations(mode);
      break;
    case "Rotation":
      rotationObject(object, objects);
      resetTransformations(mode);
      break;
    case "Scale":
      scaleObject(object, objects);
      resetTransformations(mode);
      break;
  }
}

function handleDoubleClick(p1, p2) {
  switch (mode) {
    case "DDA":
      drawLineDDA(p1.x, p1.y, p2.x, p2.y, ctx);
      objects.push({
        type: "line",
        start: { x: p1.x, y: p1.y },
        end: { x: p2.x, y: p2.y },
        algorithm: mode,
      });
      points = [];
      resetShape();
      break;
    case "Bresenham":
      drawLineBresenham(p1.x, p1.y, p2.x, p2.y, ctx);
      objects.push({
        type: "line",
        start: { x: p1.x, y: p1.y },
        end: { x: p2.x, y: p2.y },
        algorithm: mode,
      });
      points = [];
      resetShape();
      break;
    case "Circle":
      drawCircle(p1.x, p1.y, p2.x, p2.y);
      objects.push({
        type: "circle",
        start: { x: p1.x, y: p1.y },
        end: { x: p2.x, y: p2.y },
        algorithm: mode,
      });
      points = [];
      resetShape();
      break;
    case "CodedRegions":
    case "ParametricEquation":
      cropping(p1.x, p1.y, p2.x, p2.y, mode, objects);
      points = [];
      resetShape();
      break;
  }
}

function setMode(selectedMode) {
  mode = selectedMode;
  points = [];
}

function toggleTextClass(element) {
  click = !click;
  element.className = click ? "single-text-clicked" : "single-text";
  if (!click) {
    mode = "select";
  }
}

function toggleTransformationsInput(transformation) {
  switch (transformation) {
    case "Reflection":
      // const asisContainer = document.querySelector(
      //   ".input-transformations-asis"
      // );
      asisContainer.className = click
        ? "input-transformations-asis_clicked"
        : "input-transformations-asis";
      break;
    case "Scale":
    case "Translation":
      // const coordinatesContainer = document.querySelector(
      //   ".input-transformations-coordinates"
      // );
      coordinatesContainer.className = click
        ? "input-transformations-coordinates_clicked"
        : "input-transformations-coordinates";
      break;
    case "Rotation":
      // const angleContainer = document.querySelector(
      //   ".input-transformations-angle"
      // );
      angleContainer.className = click
        ? "input-transformations-angle_clicked"
        : "input-transformations-angle";
      break;
  }
}

function resetShape() {
  toggleTextClass(selectedObject);
  selectedObject = null;
}

function resetTransformations(mode) {
  toggleTextClass(selectedObject);
  toggleTransformationsInput(mode);
  selectedObject = null;
}

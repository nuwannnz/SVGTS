import { SVGTS, SVGTSPolyline } from "../dist";

const container = document.createElement("div");
container.style.width = "100vw";
container.style.height = "100vh";
container.style.border = "1px solid #000";

document.body.appendChild(container);

const lines: SVGTSPolyline[] = [];

const lineClickHandler = (lineId: string) => {
  const line = lines.find((l) => l.Id === lineId);
  line.extend(95, 95);
};

const lineMouseMoveHandler = (lineId: string) => {
  if (!isMouseDown) {
    return;
  }
  const line = lines.find((l) => l.Id === lineId);
  line.remove();
};

const svg = new SVGTS(container);
svg.addPolylineClickListner(lineClickHandler);
svg.addPolylineMouseMoveListner(lineMouseMoveHandler);

let isMouseDown = false;

let currentPolyline: SVGTSPolyline = null;

container.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  currentPolyline = svg.createPolyline();
  currentPolyline.stroke(8, "yellow");
  currentPolyline.draw([[e.x, e.y]]);
});
container.addEventListener("mousemove", (e) => {
  if (isMouseDown) {
    currentPolyline.extend(e.x, e.y);
  }
});
container.addEventListener("mouseup", (e) => {
  isMouseDown = false;
  lines.push(currentPolyline);
  currentPolyline = null;
});

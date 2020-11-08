import { v4 as UUID } from "uuid";

type SVGDocSize = {
  width: number | string;
  height: number | string;
};

type SVGTSPolylinePoints = [number, number][];
type SVGTSPolylineMouseEventHandler = (id: string) => void;

export class SVGTSPolyline {
  private points: SVGTSPolylinePoints = [];
  private svgDoc: SVGElement;
  private polylineElement!: SVGPolylineElement;
  private onClickCb: SVGTSPolylineMouseEventHandler;
  private onMouseMoveCb: SVGTSPolylineMouseEventHandler;

  constructor(
    svgDoc: SVGElement,
    onClickCb: SVGTSPolylineMouseEventHandler,
    onMouseMoveCb: SVGTSPolylineMouseEventHandler,
    lineId: string = ""
  ) {
    this.svgDoc = svgDoc;
    this.onClickCb = onClickCb;
    this.onMouseMoveCb = onMouseMoveCb;

    this.init(lineId);
  }

  private init(lineId: string) {
    if (lineId) {
      // load existing element
      this.polylineElement = (document.getElementById(
        lineId
      ) as any) as SVGPolylineElement;
      if (this.polylineElement.hasAttributeNS(null, "points")) {
        this.points = this.polylineElement
          .getAttributeNS(null, "points")
          ?.split(" ")
          .map((p) => {
            const pointsStr = p.split(",");
            return [parseInt(pointsStr[0]), parseInt(pointsStr[0])];
          }) as SVGTSPolylinePoints;
      }
    } else {
      // create new element
      this.polylineElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );

      this.polylineElement.id = UUID();

      this.polylineElement.addEventListener("click", () => {
        this.onClickCb(this.polylineElement.id);
      });

      this.polylineElement.addEventListener("mousemove", () => {
        this.onMouseMoveCb(this.polylineElement.id);
      });

      this.svgDoc.appendChild(this.polylineElement);
      this.stroke();
    }
  }

  get Id() {
    return this.polylineElement.id;
  }

  set Id(newId: string) {
    this.polylineElement.id = newId;
  }

  draw(points: SVGTSPolylinePoints) {
    this.points = points;

    this.polylineElement.setAttributeNS(
      null,
      "points",
      this.points.map((p) => `${p[0]},${p[1]}`).join(" ")
    );
    return this;
  }

  extend(x: number, y: number) {
    this.points.push([x, y]);
    return this.draw(this.points);
  }

  stroke(width = 2, color = "#000") {
    this.polylineElement.style.fill = "none";
    this.polylineElement.style.stroke = color;
    this.polylineElement.style.strokeWidth = `${width}`;
    return this;
  }

  remove() {
    this.svgDoc.removeChild(this.polylineElement);
  }
}

export class SVGTS {
  private containerElement: HTMLElement;
  private svgDoc: SVGElement;
  private clickListners: SVGTSPolylineMouseEventHandler[] = [];
  private mouseMoveListners: SVGTSPolylineMouseEventHandler[] = [];

  constructor(
    container: HTMLElement,
    size: SVGDocSize = { width: "100%", height: "100%" }
  ) {
    this.containerElement = container;
    this.svgDoc = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    this.svgDoc.setAttribute("width", `${size.width}`);
    this.svgDoc.setAttribute("height", `${size.height}`);

    this.containerElement.appendChild(this.svgDoc);

    this.handlePolylineClicked = this.handlePolylineClicked.bind(this);
    this.handlePolylineMouseMoved = this.handlePolylineMouseMoved.bind(this);
  }

  private handlePolylineClicked(clickedLineId: string) {
    this.clickListners.forEach((cb) => cb(clickedLineId));
  }

  private handlePolylineMouseMoved(clickedLineId: string) {
    this.mouseMoveListners.forEach((cb) => cb(clickedLineId));
  }

  addPolylineClickListner(cb: SVGTSPolylineMouseEventHandler) {
    this.clickListners.push(cb);
  }

  addPolylineMouseMoveListner(cb: SVGTSPolylineMouseEventHandler) {
    this.mouseMoveListners.push(cb);
  }

  createPolyline() {
    return new SVGTSPolyline(
      this.svgDoc,
      this.handlePolylineClicked,
      this.handlePolylineMouseMoved
    );
  }

  getPolyline(lineId: string) {
    if (!document.getElementById(lineId)) {
      return null;
    }
    return new SVGTSPolyline(
      this.svgDoc,
      this.handlePolylineClicked,
      this.handlePolylineMouseMoved,
      lineId
    );
  }
}

import { v4 as UUID } from "uuid";
import { SVGTSMouseEventHandler } from "./SVGTS";

export type SVGTSPolylinePoints = [number, number][];

export class SVGTSPolyline {
  private points: SVGTSPolylinePoints = [];
  private svgDoc: SVGElement;
  private polylineElement!: SVGPolylineElement;
  private onClickCb: SVGTSMouseEventHandler;
  private onMouseMoveCb: SVGTSMouseEventHandler;

  constructor(
    svgDoc: SVGElement,
    onClickCb: SVGTSMouseEventHandler,
    onMouseMoveCb: SVGTSMouseEventHandler,
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
      this.polylineElement.classList.add("svgts-polyline");
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

import { SVGTSPolyline } from "./SVGTSPolyline";
import { SVGTSCircle } from "./SVGTSCircle";

export * from "./SVGTSCircle";
export * from "./SVGTSPolyline";

export type SVGTSMouseEventHandler = (id: string) => void;

type SVGDocSize = {
  width: number | string;
  height: number | string;
};

export class SVGTS {
  private containerElement: HTMLElement;
  private svgDoc: SVGElement;
  private clickListners: SVGTSMouseEventHandler[] = [];
  private mouseMoveListners: SVGTSMouseEventHandler[] = [];

  constructor(
    container: HTMLElement,
    size: SVGDocSize = { width: "100%", height: "100%" },
    svgElement?: SVGElement
  ) {
    this.containerElement = container;
    if (svgElement) {
      this.svgDoc = svgElement;
    } else {
      this.svgDoc = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      this.containerElement.appendChild(this.svgDoc);
    }
    this.svgDoc.setAttribute("width", `${size.width}`);
    this.svgDoc.setAttribute("height", `${size.height}`);

    this.handleShapeClicked = this.handleShapeClicked.bind(this);
    this.handleMouseMovedOverShape = this.handleMouseMovedOverShape.bind(this);
  }

  private handleShapeClicked(clickedLineId: string) {
    this.clickListners.forEach((cb) => cb(clickedLineId));
  }

  private handleMouseMovedOverShape(clickedLineId: string) {
    this.mouseMoveListners.forEach((cb) => cb(clickedLineId));
  }

  addShapeClickListner(cb: SVGTSMouseEventHandler) {
    this.clickListners.push(cb);
  }

  addMouseMoveOverShapeListner(cb: SVGTSMouseEventHandler) {
    this.mouseMoveListners.push(cb);
  }

  createPolyline() {
    return new SVGTSPolyline(
      this.svgDoc,
      this.handleShapeClicked,
      this.handleMouseMovedOverShape
    );
  }

  createCircle() {
    return new SVGTSCircle(
      this.svgDoc,
      this.handleShapeClicked,
      this.handleMouseMovedOverShape
    );
  }

  getSvgElement() {
    return this.svgDoc;
  }

  getPolyline(lineId: string) {
    if (!document.getElementById(lineId)) {
      return null;
    }
    return new SVGTSPolyline(
      this.svgDoc,
      this.handleShapeClicked,
      this.handleMouseMovedOverShape,
      lineId
    );
  }

  getAllPolylines() {
    const polylines: SVGTSPolyline[] = [];

    const polylineElements = this.svgDoc.getElementsByClassName(
      "svgts-polyline"
    );
    for (let i = 0; i < polylineElements.length; i++) {
      const element = polylineElements[i];
      polylines.push(
        new SVGTSPolyline(
          this.svgDoc,
          this.handleShapeClicked,
          this.handleMouseMovedOverShape,
          element.id
        )
      );
    }
    return polylines;
  }

  getCircle(circleId: string) {
    if (!document.getElementById(circleId)) {
      return null;
    }
    return new SVGTSCircle(
      this.svgDoc,
      this.handleShapeClicked,
      this.handleMouseMovedOverShape,
      circleId
    );
  }

  getAllCircles() {
    const circles: SVGTSCircle[] = [];

    const circleElements = this.svgDoc.getElementsByClassName("svgts-circle");
    for (let i = 0; i < circleElements.length; i++) {
      const element = circleElements[i];
      circles.push(
        new SVGTSCircle(
          this.svgDoc,
          this.handleShapeClicked,
          this.handleMouseMovedOverShape,
          element.id
        )
      );
    }
    return circles;
  }
}

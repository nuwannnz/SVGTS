import { v4 as UUID } from "uuid";
import { SVGTSMouseEventHandler } from "./SVGTS";

export class SVGTSCircle {
  private x: number = 0;
  private y: number = 0;
  private radius: number = 0;
  private svgDoc: SVGElement;
  private circleElement!: SVGCircleElement;
  private onClickCb: SVGTSMouseEventHandler;
  private onMouseMoveCb: SVGTSMouseEventHandler;
  private injected = false;

  constructor(
    svgDoc: SVGElement,
    onClickCb: SVGTSMouseEventHandler,
    onMouseMoveCb: SVGTSMouseEventHandler,
    circleId: string = ""
  ) {
    this.svgDoc = svgDoc;
    this.onClickCb = onClickCb;
    this.onMouseMoveCb = onMouseMoveCb;

    this.init(circleId);
  }

  private init(circleId: string) {
    if (circleId) {
      // load existing element
      this.circleElement = (document.getElementById(
        circleId
      ) as any) as SVGCircleElement;
      if (this.circleElement.hasAttributeNS(null, "cx")) {
        this.x = parseInt(
          this.circleElement.getAttributeNS(null, "cx") as string
        );
        this.y = parseInt(
          this.circleElement.getAttributeNS(null, "cy") as string
        );
        this.radius = parseInt(
          this.circleElement.getAttributeNS(null, "r") as string
        );
      }
    } else {
      // create new element
      this.circleElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

      this.circleElement.id = UUID();

      this.initEventListners();

      this.svgDoc.appendChild(this.circleElement);
      this.injected = true;
      this.fill();
    }
  }

  private initEventListners() {
    this.circleElement.addEventListener("click", () => {
      this.onClickCb(this.circleElement.id);
    });

    this.circleElement.addEventListener("mousemove", () => {
      this.onMouseMoveCb(this.circleElement.id);
    });
  }

  get Id() {
    return this.circleElement.id;
  }

  set Id(newId: string) {
    this.circleElement.id = newId;
  }

  position(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.circleElement.setAttributeNS(null, "cx", `${this.x}`);
    this.circleElement.setAttributeNS(null, "cy", `${this.y}`);
  }

  draw(radius: number) {
    this.radius = radius;

    this.circleElement.setAttributeNS(null, "r", `${this.radius}`);
    return this;
  }

  fill(color = "#000") {
    this.circleElement.style.fill = color;
    return this;
  }

  remove() {
    if (!this.injected) {
      return;
    }
    this.svgDoc.removeChild(this.circleElement);
  }

  inject() {
    if (this.injected) {
      return;
    }
    this.svgDoc.appendChild(this.circleElement);
    this.initEventListners();
  }
}

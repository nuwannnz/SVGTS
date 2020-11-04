import {  v4 as UUID} from "uuid";

type SVGDocSize = {
  width: number | string;
  height: number | string;
};

type SVGTSPolylinePoints = [number, number][];
type SVGTSPolylineClickHandler = (id:string) => void;

export class SVGTSPolyline {
  private points: SVGTSPolylinePoints = [];
  private svgDoc: SVGElement;
  private polylineElement: SVGPolylineElement;

  constructor(svgDoc: SVGElement, onClickCb:SVGTSPolylineClickHandler ) {
    this.svgDoc = svgDoc;
    this.polylineElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline"
    );
    this.polylineElement.id = UUID();
    this.polylineElement.addEventListener('click', () =>{
        onClickCb(this.polylineElement.id);
    })
    this.svgDoc.appendChild(this.polylineElement);
    this.stroke();
  }

  get Id(){
      return this.polylineElement.id;
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

  extend(x:number, y:number){
    this.points.push([x, y]);
    return this.draw(this.points);
  }

  stroke(width=2, color="#000"){
      this.polylineElement.style.fill ='none';
      this.polylineElement.style.stroke =color;
      this.polylineElement.style.strokeWidth = `${width}`;
      return this;
  }

}

export class SVGTS {
  private containerElement: HTMLElement;
  private svgDoc: SVGElement;
  private clickCb:SVGTSPolylineClickHandler;

  constructor(
    container: HTMLElement,    
    clickCb: SVGTSPolylineClickHandler,
    size: SVGDocSize = { width: "100%", height: "100%" }
  ) {
    this.containerElement = container;
    this.svgDoc = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    this.svgDoc.setAttribute("width", `${size.width}`);
    this.svgDoc.setAttribute("height", `${size.height}`);

    this.containerElement.appendChild(this.svgDoc);
    this.clickCb = clickCb;

    this.handlePolylineClicked = this.handlePolylineClicked.bind(this);
  }

  private handlePolylineClicked(clickedLineId:string){
    this.clickCb(clickedLineId);
  }

  createPolyline() {
    return new SVGTSPolyline(this.svgDoc, this.handlePolylineClicked);
  }
}

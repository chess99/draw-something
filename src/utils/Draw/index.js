import DrawLine from './DrawLine'
import DrawHistory from './DrawHistory'

import { evtPointInPage, getOffset } from "./util";

class Draw {
  constructor(canvasSelector) {
    this.drawLine = new DrawLine(canvasSelector)
    this.drawHistory = new DrawHistory()
    this.drawing = false

    let canvas = document.querySelector(canvasSelector)
    this.context = canvas.getContext('2d');
    this.canvasWidth = canvas.width
    this.canvasHeight = canvas.height

    this._canX = getOffset(canvas).left;
    this._canY = getOffset(canvas).top;
    // console.log("offset", this._canX, this._canY);
  }

  evtPointInCanvas(evt) {
    let p = evtPointInPage(evt);
    let x = p.x - this._canX;
    let y = p.y - this._canY;
    return { x, y }
  }

  isPointInCanvasArea(x, y) {
    return (
      x >= 0 && x <= this.canvasWidth && y >= 0 && y <= this.canvasHeight
    )
  }

  drawStart(x, y) {
    // if (!this.isPointInCanvasArea(x, y)) {
    //   return;
    // }
    this.drawing = true;
    this.drawLine.start(x, y);
    this.drawHistory.start(x, y);
  }

  drawStartEvt(evt) {
    evt.preventDefault();
    let p = this.evtPointInCanvas(evt)
    return this.drawStart(p.x, p.y)
  }

  drawTo(x, y) {
    if (!this.drawing) return;
    // if (!this.isPointInCanvasArea(x, y)) {
    //   this.drawEnd();
    //   return;
    // }
    this.drawLine.drawTo(x, y);
    this.drawHistory.drawTo(x, y);
  }

  drawToEvt(evt) {
    evt.preventDefault();
    let p = this.evtPointInCanvas(evt)
    return this.drawTo(p.x, p.y)
  }

  drawEnd() {
    this.drawing = false;
    this.drawLine.end();
    this.drawHistory.end();
  }

  drawEndEvt(evt) {
    evt.preventDefault();
    return this.drawEnd()
  }

  selectLineWidth(width) {
    // console.log("selectLineWidth", width);
    this.drawLine.setLineWidth(width);
    this.drawHistory.setLineWidth(width);
  }

  selectBrushColor(color) {
    // console.log("selectBrushColor", color);
    if (typeof color !== "string") return;
    this.drawLine.setBrushColor(color);
    this.drawHistory.setBrushColor(color);
  }

  clearCanvas() {
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  clearHistory() {
    this.drawHistory.clear();
  }

  clear() {
    this.clearCanvas()
    this.clearHistory()
  }

  undo() {
    // console.log("undo");
    this.drawHistory.undo();
    this.clearCanvas();
    this.drawHistory.history.forEach(stroke => {
      this.drawLine.drawStoke(stroke);
    });
  }

  redo() {
    // console.log("redo");
    this.drawHistory.redo();
    this.clearCanvas();
    this.drawHistory.history.forEach(stroke => {
      this.drawLine.drawStoke(stroke);
    });
  }

}

export default Draw

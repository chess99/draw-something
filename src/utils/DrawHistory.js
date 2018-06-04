class DrawHistory {
  constructor() {
    this.maxRecord = 5;
    this.strokeIndex = 0; // 此位置为准备写入数据的位置

    this.lineWidth = 1
    this.strokeStyle = 'black'

    this.currStroke = []
    this.strokeHistory = []
  }

  setLineWidth(width) {
    this.lineWidth = width
  }

  setBrushColor(color) {
    this.strokeStyle = color
  }

  start(x, y) {
    this.currStroke = []
    this.currStroke.push(this.lineWidth, this.strokeStyle, x, y)
  }

  drawTo(x, y) {
    this.currStroke.push(x, y)
  }

  printInfo() {
    console.log(this.strokeHistory.length, this.strokeIndex)
  }

  end() {
    if (this.strokeIndex !== this.strokeHistory.length - 1) {
      this.strokeHistory[this.strokeIndex] = this.currStroke
    } else {
      this.strokeHistory.push(this.currStroke)
    }
    this.currStroke = []
    this.strokeIndex += 1
    this.printInfo()
  }

  get history() {
    return this.strokeHistory.slice(0, this.strokeIndex)
  }

  undo() {
    if (this.strokeIndex == 0) return
    this.strokeIndex -= 1
    this.printInfo()
  }

  redo() {
    if (this.strokeIndex == this.strokeHistory.length) return
    this.strokeIndex += 1
    this.printInfo()
  }

  clear() {
    this.currStroke = []
    this.strokeHistory = []
    this.strokeIndex = 0
  }

}

export default DrawHistory

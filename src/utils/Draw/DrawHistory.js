class DrawHistory {
  constructor() {
    this.strokeIndex = 0; // 此位置为准备写入数据的位置

    this.lineWidth = 2
    this.strokeStyle = '#000'

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
    // console.log(this.strokeHistory.length, this.strokeIndex)
  }

  end() {
    if (this.strokeIndex !== this.strokeHistory.length) {
      // delete undo record behind strokeIndex
      this.strokeHistory = this.strokeHistory.slice(0, this.strokeIndex)
    }
    this.strokeHistory.push(this.currStroke)
    this.strokeIndex += 1
    this.currStroke = []
    this.printInfo()
  }

  get history() {
    // [0,strokeIndex)
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

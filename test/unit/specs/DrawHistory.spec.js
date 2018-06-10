import Vue from 'vue'
import DrawHistory from '@/utils/Draw/DrawHistory'

describe('DrawHistory', () => {
  it('init', () => {
    const dh = new DrawHistory()
    expect(dh.history).toEqual([])
  })
  it('draw one stroke', () => {
    const dh = new DrawHistory()
    dh.start(0, 0)
    dh.drawTo(1, 1)
    dh.end()
    expect(dh.history.length).toEqual(1)
    expect(dh.history[0].length).toEqual(6)
    expect(dh.history[0]).toEqual([2, '#000', 0, 0, 1, 1])
  })
  it('setLineWidth', () => {
    const dh = new DrawHistory()

    let width = 18
    dh.setLineWidth(width)
    dh.start(0, 0)
    dh.drawTo(1, 1)
    dh.end()

    expect(dh.history[0]).toEqual([width, '#000', 0, 0, 1, 1])
  })
  it('setBrushColor', () => {
    const dh = new DrawHistory()

    let color = '#fff'
    dh.setBrushColor(color)
    dh.start(0, 0)
    dh.drawTo(1, 1)
    dh.end()
    expect(dh.history[0]).toEqual([2, color, 0, 0, 1, 1])
  })
  it('undo one stroke', () => {
    const dh = new DrawHistory()

    dh.start(0, 0)
    dh.drawTo(1, 1)
    dh.end()
    dh.undo()

    expect(dh.history.length).toEqual(0)
  })
  it('redo one stroke', () => {
    const dh = new DrawHistory()

    dh.start(0, 0)
    dh.drawTo(1, 1)
    dh.end()
    dh.undo()
    dh.redo()

    expect(dh.history[0]).toEqual([2, '#000', 0, 0, 1, 1])
  })
  it('draw after undo', () => {
    const dh = new DrawHistory()

    // 0
    dh.start(0, 0)
    dh.drawTo(1, 1)
    dh.end()
    // 1
    dh.start(0, 0)
    dh.drawTo(1, 1)
    dh.end()
    dh.start(0, 0)
    dh.drawTo(2, 2)
    dh.end()

    dh.undo()
    dh.undo()

    // 1
    dh.start(0, 0)
    dh.drawTo(3, 3)
    dh.end()

    expect(dh.history.length).toEqual(2)
    expect(dh.history[1]).toEqual([2, '#000', 0, 0, 3, 3])
  })
  it('clear history', () => {
    const dh = new DrawHistory()

    dh.start(0, 0)
    dh.drawTo(1, 1)
    dh.end()
    dh.clear()

    expect(dh.history).toEqual([])
  })
})

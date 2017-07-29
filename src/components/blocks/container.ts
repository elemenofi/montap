
import { random } from './random'

export class Container {
  constructor (x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.cx = x + w/2
    this.cy = y + h/2
    this.size = w * h
    this.strokes = [2, 4, /*6*/]
    this.lineWidth = this.strokes[Math.floor(Math.random() * this.strokes.length)];
    this.activeColor = this.getColor()
    this.active = false
  }

  x: number
  y: number
  w: number
  h: number
  cx: number
  cy: number
  size: number
  strokes: Array<number>
  lineWidth: number
  active: boolean
  activeColor: string

  getColor () {
    const colors = {
      1: '#F60201',
      2: '#1F7FC9',
      3: '#FDED01'
    }

    const color = random(1, 8)

    if (color < 4) {
      return colors[color]
    } else {
      return '#fff'
    }
  }

  paint (container) {
    const lw = this.lineWidth
    container.strokeStyle = "#000"
    container.fillStyle = "#ddd"
    container.lineWidth = lw
    container.fillRect(this.x, this.y, this.w, this.h)
    container.strokeRect(this.x + lw/2, this.y + lw/2, this.w - lw, this.h - lw)
  }
}


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
  }

  x
  y
  w
  h
  cx
  cy
  size

  active = false
  activeColor = this.getColor()
  lineWidth = random(2,5)

  getColor () {
    // jaja son los colores de http://www.colourlovers.com/palette/1442813/piet_mondrian
    const colors = {
      1: '#F60201',
      2: '#1F7FC9',
      3: '#FDED01'
    }
    const color = random(1, 10)

    if (color < 4) {
      return colors[color]
    } else {
      return '#fff'
    }
  }

  paint (container) {
    container.strokeStyle = "#000"
    container.lineWidth   = this.lineWidth
    container.fillStyle = "#ddd"
    container.fillRect(this.x, this.y, this.w, this.h)
    container.strokeRect(
      this.x, this.y,
      this.w, this.h
    )
  }
}

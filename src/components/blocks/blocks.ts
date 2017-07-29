import {
  Component,
  AfterViewInit,
} from '@angular/core'

import { Tree } from './tree'
import { Container } from './container'
import { BSP } from './bsp'
import { ScoreService } from '../../services/score'
import { HomePage } from '../../pages/home/home'
import { NavController } from 'ionic-angular'
import { Vibration } from '@ionic-native/vibration'
import { ResultPage } from '../../pages/result/result'

@Component({
  selector: 'component-blocks',
  templateUrl: 'blocks.html'
})

export class BlocksComponent implements AfterViewInit {
  constructor(
    private navCtrl: NavController,
    private scoreService: ScoreService,
    private vibration: Vibration
  ) {}

  bsp = new BSP()
  sizes: number[] = []
  largest: number
  containerTree: Tree
  ctx: CanvasRenderingContext2D

  ngAfterViewInit () {
    console.log('ngAfterViewInit: level', this.scoreService.level, 'iter', this.bsp.N_ITERATIONS )
    const canvas: any = document.getElementById('viewport')
    this.ctx = canvas.getContext('2d')

    const mainContainer = new Container(0, 0, canvas.width, canvas.height)
    this.containerTree = this.bsp.splitContainer(mainContainer, this.bsp.N_ITERATIONS)

    this
      .containerTree
      .getLeafs()
      .forEach((element) => {
        this.sizes.push(element.size)
      })

    this.largest = Math.max.apply(null, this.sizes)

    this.ctx.fillStyle = "#fff"
    this.ctx.fillRect(0, 0, canvas.width, canvas.height)
    this.containerTree.paint(this.ctx)

    if (window['cordova']) window['nativeclick'].watch(['game'])
  }

  goToNextLevel () {
    this.scoreService.level++

    // Level progress & iteration difficulty
    if (this.scoreService.level > 5) { this.bsp.N_ITERATIONS = 2 }
    if (this.scoreService.level > 15) { this.bsp.N_ITERATIONS = 3 }
    if (this.scoreService.level > 30) { this.bsp.N_ITERATIONS = 4 }
    if (this.scoreService.level > 50) { this.bsp.N_ITERATIONS = 5 }

    setTimeout(() => this.ngAfterViewInit(), 500)
  }

  drawActiveBlock (block) {
    const lw = block.lineWidth
    this.ctx.fillStyle = block.activeColor
    this.ctx.strokeStyle = "#000"
    this.ctx.lineWidth = lw
    this.ctx.fillRect(block.x, block.y, block.w, block.h)
    this.ctx.strokeRect(block.x + lw/2, block.y + lw/2, block.w - lw, block.h - lw)
  }

  wrongBlockFeedback (block: Container) {
    this.vibration.vibrate(10)

    const size = Math.round((block.w * block.h)/10000) * 2

    this.ctx.lineWidth = size
    this.ctx.strokeStyle = "#ff0000"

    this.ctx.beginPath()

    this.ctx.moveTo(block.cx - size, block.cy - size)
    this.ctx.lineTo(block.cx + size, block.cy + size)

    this.ctx.moveTo(block.cx + size, block.cy - size)
    this.ctx.lineTo(block.cx - size, block.cy + size)
    this.ctx.stroke()

    setTimeout(() => {
      this.removeCross(block)
    }, 250)
  }

  removeCross (block: Container) {
    const size = Math.round((block.w * block.h)/10000) * 2 + 2

    this.ctx.lineWidth = size

    if (block.active) {
      this.ctx.strokeStyle = block.activeColor
    } else {
      this.ctx.strokeStyle = "#A9A9A9"
    }

    this.ctx.beginPath()

    this.ctx.moveTo(block.cx - size, block.cy - size)
    this.ctx.lineTo(block.cx + size, block.cy + size)

    this.ctx.moveTo(block.cx + size, block.cy - size)
    this.ctx.lineTo(block.cx - size, block.cy + size)

    this.ctx.stroke()
  }

  missTap (element: Container) {
    // Display visual feedback
    this.wrongBlockFeedback(element)

    // Reduce life
    this.scoreService.lives--

    // Check GAME OVER
    if (this.scoreService.lives < 0) {
      this.scoreService.level = 1
      this.navCtrl.setRoot(ResultPage)
    }
  }

  tap (element: Container) {
    if (window['cordova']) window['nativeclick'].trigger()
    element.active = true
    this.drawActiveBlock(element)

    // Reset largest block
    this.sizes.splice(this.sizes.indexOf(this.largest), 1)
    this.largest = Math.max.apply(null, this.sizes)

    // Update Score
    this.scoreService.score++

    // Check Level finished
    if (this.sizes.length === 0) {
      // Update lives
      if (this.scoreService.level <= 15) {
        this.scoreService.lives++
      } else if (this.scoreService.level <= 50) {
        this.scoreService.lives += 2
      } else if (this.scoreService.level > 50) {
        this.scoreService.lives += 3
      }

      // Go to Next Level
      this.goToNextLevel()
    }
  }

  handleTap (event) {
    const x = event.layerX
    const y = event.layerY

    this
      .containerTree
      .getLeafs()
      .forEach((element) => {
        if (
          y > element.y &&
          y < element.y + element.h &&
          x > element.x &&
          x < element.x + element.w
        ) {
          if (!element.active) {
            if (element.size < this.largest) {
              this.missTap(element)
            } else {
              this.tap(element)
            }
          }
        }
      })
  }
}

import {
  Component,
  AfterViewInit,
} from '@angular/core'

import { Tree } from './tree'
//import { Point } from './point'
import { Container } from './container'
//import { random } from './random'
import { BSP } from './bsp'

import { ScoreService } from '../../services/score'

import { HomePage } from "../../pages/home/home"

import { NavController } from 'ionic-angular'

@Component({
  selector: 'component-blocks',
  templateUrl: 'blocks.html'
})

export class BlocksComponent implements AfterViewInit {
  constructor(
    private navCtrl: NavController,
    private scoreService: ScoreService
  ) {}

  bsp = new BSP()
  sizes: number[] = []
  largest: number
  container_tree: Tree
  c_context: CanvasRenderingContext2D

  ngAfterViewInit () {
    console.log('ngAfterViewInit: level', this.scoreService.level, 'iter', this.bsp.N_ITERATIONS )
    const canvas: any = document.getElementById('viewport')
    this.c_context = canvas.getContext('2d')

    const main_container = new Container(0, 0, canvas.width, canvas.height)
    this.container_tree = this.bsp.splitContainer(main_container, this.bsp.N_ITERATIONS)

    this.container_tree.getLeafs().forEach((element) => {
      this.sizes.push(element.size)
    })

    this.largest = Math.max.apply(null, this.sizes)

    this.c_context.fillStyle = "#fff"
    this.c_context.fillRect(0, 0, canvas.width, canvas.height)
    this.container_tree.paint(this.c_context)
  }

  goToNextLevel () {

    this.scoreService.level++

    // Level progress & iteration difficulty
    if (this.scoreService.level > 5) { this.bsp.N_ITERATIONS = 2 }
    if (this.scoreService.level > 15) { this.bsp.N_ITERATIONS = 3 }
    if (this.scoreService.level > 30) { this.bsp.N_ITERATIONS = 4 }
    if (this.scoreService.level > 50) { this.bsp.N_ITERATIONS = 5 }

    // Change view
    this.ngAfterViewInit()
  }

  drawActiveSelf (block) {
    this.c_context.fillStyle = block.activeColor
    this.c_context.fillRect(block.x, block.y, block.w, block.h)

    this.c_context.lineWidth = block.lineWidth
    this.c_context.strokeStyle = "#000"
    this.c_context.strokeRect(block.x, block.y, block.w, block.h)
  }

  wrongBlockFeedback (block) {

    // Cross Lines settings
    this.c_context.lineWidth = 10
    this.c_context.strokeStyle = "#ff0000"

    // Draw Cross
    this.c_context.beginPath();

    this.c_context.moveTo(block.cx - 10, block.cy - 10);
    this.c_context.lineTo(block.cx + 10, block.cy + 10);

    this.c_context.moveTo(block.cx + 10, block.cy - 10);
    this.c_context.lineTo(block.cx - 10, block.cy + 10);
    this.c_context.stroke();

    // Erase Cross later  (ugh..)
    setTimeout(function(block, ctx) {
      return function() {
        // Everything a bit bigger because of some weird aliasing..
        ctx.lineWidth = 12
        if (block.active) {
          ctx.strokeStyle = block.activeColor
        } else {
          ctx.strokeStyle = "#ddd"
        }
        ctx.beginPath();

        ctx.moveTo(block.cx - 12, block.cy - 12);
        ctx.lineTo(block.cx + 12, block.cy + 12);

        ctx.moveTo(block.cx + 12, block.cy - 12);
        ctx.lineTo(block.cx - 12, block.cy + 12);
        ctx.stroke();
      }
    }(block, this.c_context), 250)
  }

  handleTap (event) {
    const x = event.layerX
    const y = event.layerY

    this
    .container_tree
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
            // Display visual feedback
            this.wrongBlockFeedback(element)

            // Reduce life
            this.scoreService.lives--

            // Check GAME OVER
            if (this.scoreService.lives < 0) {
              alert('Your score was ' + this.scoreService.score / this.scoreService.time)
              this.navCtrl.setRoot(HomePage)
            }
          } else {
            // Set container to active and paint with Mondrian color
            element.active = true
            this.drawActiveSelf(element)

            // Reset largest block
            this.sizes.splice(this.sizes.indexOf(this.largest), 1)
            this.largest = Math.max.apply(null, this.sizes)

            // Update Score
            this.scoreService.score++

            // Check Level finished
            if (this.sizes.length === 0) {

              // Update lives
              this.scoreService.lives++

              // Go to Next Level
              this.goToNextLevel()

            }
          }
        }
      }
    })
  }
}

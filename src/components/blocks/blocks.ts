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

  drawSelf (block) {
    this.c_context.fillStyle = block.activeColor
    this.c_context.fillRect(block.x, block.y, block.w, block.h)

    this.c_context.lineWidth = block.lineWidth
    this.c_context.strokeStyle = "#000"
    this.c_context.strokeRect(block.x, block.y, block.w, block.h)
  }

  handleTap (event) {
    const x = event.layerX
    const y = event.layerY

    console.log('Click: x', x, 'y', y)

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

            //this.c_context.fillStyle = element.activeColor
            //this.c_context.fillRect(element.x, element.y, element.w, element.h)

            //this.c_context.lineWidth = element.lineWidth
            //this.c_context.strokeStyle = "#000"
            //this.c_context.strokeRect(element.x, element.y, element.w, element.h)

            this.drawSelf(element)

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

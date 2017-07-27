import {
  Component,
  AfterViewInit,
} from '@angular/core';

import { Tree } from './tree'
import { Point } from './point'
import { Container } from './container'
import { random } from './random'
import { BSP } from './bsp'

import { ScoreService } from '../../services/score'

@Component({
  selector: 'component-blocks',
  templateUrl: 'blocks.html'
})

export class BlocksComponent implements AfterViewInit {
  constructor(
    private scoreService: ScoreService
  ) {}

  bsp = new BSP()
  sizes: number[] = []
  largest: number
  container_tree: Tree
  c_context: CanvasRenderingContext2D

  ngAfterViewInit () {
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

    canvas.addEventListener('click', event => this.handleTap(event))
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
            this.scoreService.score--;
          } else {
            // Set container to active and paint with Mondrian color
            element.active = true

            this.c_context.fillStyle = element.activeColor
            this.c_context.fillRect(element.x, element.y, element.w, element.h)

            this.c_context.lineWidth = element.lineWidth
            this.c_context.strokeRect(element.x, element.y, element.w, element.h)

            // Reset largest
            this.sizes.splice(this.sizes.indexOf(this.largest), 1)
            this.largest = Math.max.apply(null, this.sizes)

            if (this.sizes.length === 0) {
              this.scoreService.score++;
            }
          }
        }
      }
    })
  }
}

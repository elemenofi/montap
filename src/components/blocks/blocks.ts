import {
  Component,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'component-blocks',
  templateUrl: 'blocks.html'
})
export class BlocksComponent implements AfterViewInit {
  constructor(
  ) {}

  ngAfterViewInit () {
    class Tree {
      leaf
      lchild
      rchild
      constructor (leaf) {
        this.leaf = leaf
      }

      getLeafs () {
        if (this.lchild === undefined && this.rchild === undefined)
          return [this.leaf]
        else
          return [].concat(this.lchild.getLeafs(), this.rchild.getLeafs())
      }

      getLevel (level, queue) {
        if (queue === undefined)
          queue = []
        if (level == 1) {
          queue.push(this)
        } else {
          if (this.lchild !== undefined)
            this.lchild.getLevel(level-1, queue)
          if (this.rchild !== undefined)
            this.rchild.getLevel(level-1, queue)
        }
        return queue
      }

      paint (container) {
        this.leaf.paint(container)
        if (this.lchild !== undefined)
          this.lchild.paint(container)
        if (this.rchild !== undefined)
          this.rchild.paint(container)
      }
    }

    class Point {
      x
      y
      constructor (x, y) {
        this.x = x
        this.y = y
      }
    }

    const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

    class Container {
      x
      y
      w
      h
      active
      activeColor
      lineWidth
      size
      constructor (x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.active = false
        this.activeColor = this.getColor()
        this.lineWidth = random(2,4)
        this.size = w * h
      }

      // No se me escapo q pusiste los tonos de Sweden :D
      colors = {
        1: '#F60201',
        2: '#1F7FC9',
        3: '#FDED01'
      }

      getColor () {
        const color = random(1, 10)
        if (color < 4) {
          return this.colors[color]
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

    const split_container = (container, iter) => {
      const root = new Tree(container)
      if (iter != 0) {
        const sr = random_split(container)
        root.lchild = split_container(sr[0], iter-1)
        root.rchild = split_container(sr[1], iter-1)
      }
      return root
    }

    const random_split = (container) => {
      var r1, r2
      if (random(0, 1) == 0) {
        // Vertical
        r1 = new Container(
          container.x, container.y,             // r1.x, r1.y
          random(1, container.w), container.h   // r1.w, r1.h
        )
        r2 = new Container(
          container.x + r1.w, container.y,      // r2.x, r2.y
          container.w - r1.w, container.h       // r2.w, r2.h
        )

        if (DISCARD_BY_RATIO) {
          const r1_w_ratio = r1.w / r1.h
          const r2_w_ratio = r2.w / r2.h
          if (r1_w_ratio < W_RATIO || r2_w_ratio < W_RATIO) {
            return random_split(container)
          }
        }
      } else {
        // Horizontal
        r1 = new Container(
          container.x, container.y,             // r1.x, r1.y
          container.w, random(1, container.h)   // r1.w, r1.h
        )
        r2 = new Container(
          container.x, container.y + r1.h,      // r2.x, r2.y
          container.w, container.h - r1.h       // r2.w, r2.h
        )

        if (DISCARD_BY_RATIO) {
          const r1_h_ratio = r1.h / r1.w
          const r2_h_ratio = r2.h / r2.w
          if (r1_h_ratio < H_RATIO || r2_h_ratio < H_RATIO) {
            return random_split(container)
          }
        }
      }
      return [r1, r2]
    }

    const canvas: any  = document.getElementById('viewport')
    const N_ITERATIONS = 4
    const DISCARD_BY_RATIO = true
    const H_RATIO          = 0.25
    const W_RATIO          = 0.25

    const c_context = canvas.getContext('2d')

    const main_container = new Container(0, 0, canvas.width, canvas.height)
    const container_tree = split_container(main_container, N_ITERATIONS)

    // Size helpers
    // Esto es lo mas simple y parece q anda ok...
    let sizes = []
    container_tree.getLeafs().forEach((element) => {
      sizes.push(element.size)
    })
    let largest = Math.max.apply(null, sizes)

    c_context.fillStyle = "#fff"
    c_context.fillRect(0, 0, canvas.width, canvas.height)
    container_tree.paint(c_context)

    canvas.addEventListener('click', (event) => {

        // layerX te da lo q intentabas hacer con pageX + el offset
        const x = event.layerX
        const y = event.layerY

        console.log('Click: x', x, 'y', y)

        container_tree.getLeafs().forEach((element) => {
            if (y > element.y &&
                y < element.y + element.h &&
                x > element.x &&
                x < element.x + element.w) {
                  if (!element.active) {
                    if (element.size < largest) {
                      alert("You lose")
                    } else {
                      // Set container to active and paint with Mondrian color
                      element.active = true
                      c_context.fillStyle = element.activeColor
                      c_context.fillRect(element.x, element.y, element.w, element.h)
                      c_context.lineWidth = element.lineWidth
                      c_context.strokeRect(element.x, element.y, element.w, element.h)

                      // Reset largest
                      sizes.splice(sizes.indexOf(largest), 1)
                      largest = Math.max.apply(null, sizes)

                      if (sizes.length === 0) {
                        alert("You win")
                      }
                    }

                  }
            }
        })
    }, false)

  }
}

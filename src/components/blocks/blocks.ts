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
      center: Point
      constructor (x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.center = new Point(
          this.x + (this.w/2),
          this.y + (this.h/2)
        )
        console.log('x', this.x)
        console.log('y', this.y)
        console.log('w', this.w)
        console.log('h', this.h)
        console.log('c', this.center)
      }

      paint (container) {
        container.strokeStyle = "#000"
        container.lineWidth   = 1
        container.strokeRect(
          this.x, this.y,   // SQUARE era para alinear las lineas a una tilegrid, no es necesario para esto
          this.w, this.h    // SQUARE era para alinear las lineas a una tilegrid, no es necesario para esto
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
    console.log(canvas.width) // esto no devolvia bien pq canvas lo necesitaba en el tag html en vez de css, por eso deformaba
    const N_ITERATIONS = 3
    const DISCARD_BY_RATIO = true
    const H_RATIO          = 0.25
    const W_RATIO          = 0.25

    const c_context = canvas.getContext('2d')

    const main_container = new Container(0, 0, canvas.width, canvas.height)
    const container_tree = split_container(main_container, N_ITERATIONS)

    c_context.fillStyle = "#fff"
    c_context.fillRect(0, 0, canvas.width, canvas.height)
    container_tree.paint(c_context)
  }
}

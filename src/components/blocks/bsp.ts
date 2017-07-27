import { Container } from './container'
import { Tree } from './tree'
import { random } from './random'

export class BSP {
  DISCARD_BY_RATIO  = true
  H_RATIO           = 0.25
  W_RATIO           = 0.25
  N_ITERATIONS      = 4

  splitContainer (container, iter) {
    const root = new Tree(container)

    if (iter != 0) {
      const sr = this.randomSplit(container)
      root.lchild = this.splitContainer(sr[0], iter-1)
      root.rchild = this.splitContainer(sr[1], iter-1)
    }

    return root
  }

  randomSplit (container: Container) {
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

      if (this.DISCARD_BY_RATIO) {
        const r1_w_ratio = r1.w / r1.h
        const r2_w_ratio = r2.w / r2.h
        if (r1_w_ratio < this.W_RATIO || r2_w_ratio < this.W_RATIO) {
          return this.randomSplit(container)
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

      if (this.DISCARD_BY_RATIO) {
        const r1_h_ratio = r1.h / r1.w
        const r2_h_ratio = r2.h / r2.w
        if (r1_h_ratio < this.H_RATIO || r2_h_ratio < this.H_RATIO) {
          return this.randomSplit(container)
        }
      }
    }

    return [r1, r2]
  }
}

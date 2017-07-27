
export class Tree {
  constructor (leaf) {
    this.leaf = leaf
  }

  leaf
  lchild
  rchild

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

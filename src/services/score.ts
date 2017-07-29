import { Injectable } from '@angular/core'

@Injectable()

export class ScoreService {
  constructor () {
    this.init
  }

  lives = 0
  score = 0
  time = 0
  level = 1

  init () {
    this.lives = 0
    this.score = 0
    this.time = 0
    this.level = 1
  }
}

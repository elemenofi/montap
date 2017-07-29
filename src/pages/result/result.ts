import { Component, OnInit } from '@angular/core'
import { NavController } from 'ionic-angular'
import { GamePage } from '../game/game'
import { ScoreService } from '../../services/score'

@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})

export class ResultPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private scoreService: ScoreService,
  ) {
  }

  score: number

  ngOnInit () {
    this.score = 100 - Math.round(this.scoreService.score / this.scoreService.time * 10) + this.scoreService.level
  }

  dismiss() {
    this.scoreService.init()
    this.navCtrl.setRoot(GamePage)
  }
}

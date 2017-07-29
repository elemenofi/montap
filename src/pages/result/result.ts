import { Component, OnInit } from '@angular/core'
import { NavController } from 'ionic-angular'
import { HomePage } from '../home/home'
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
    this.score = this.scoreService.score / this.scoreService.time
  }

  dismiss() {
    this.navCtrl.setRoot(HomePage)
  }
}

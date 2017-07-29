import { Component, OnInit } from '@angular/core'
import { NavController } from 'ionic-angular'
import { GamePage } from './../game/game'
import { ScoreService } from "../../services/score";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private scoreService: ScoreService,
  ) {}

  previousScore: string

  ngOnInit () {
    this.previousScore = localStorage.getItem('score')
  }

  start () {
    this.navCtrl.setRoot(GamePage)
    this.scoreService.init()
  }
}

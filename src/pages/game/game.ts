import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GameService } from '../../services/game'

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage implements OnInit {
  constructor(
    public navCtrl: NavController,
    private gameService: GameService
  ) {}

  ngOnInit () {
    this.gameService.init()
  }
}

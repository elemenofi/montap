import { Component, OnInit } from '@angular/core'
import { NavController } from 'ionic-angular'
import { GamePage } from './../game/game'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  constructor(public navCtrl: NavController) {}

  ngOnInit () {
    this.navCtrl.push(GamePage)
  }

  start () {
    this.navCtrl.push(GamePage)
  }
}

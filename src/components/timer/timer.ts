import { Component, AfterViewInit } from '@angular/core'
import { Observable } from 'rxjs/Rx'


import { ScoreService } from "../../services/score";

@Component({
  selector: 'component-timer',
  templateUrl: 'timer.html'
})

export class TimerComponent implements AfterViewInit {
  constructor(
    public scoreService: ScoreService
  ) {}

  ngAfterViewInit () {
    const timer = Observable.timer(1, 1000)
    timer.subscribe(t => this.scoreService.time = t)
  }
}

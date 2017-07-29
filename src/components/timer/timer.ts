import { Component, AfterViewInit } from '@angular/core'
import { Observable, Subscription } from 'rxjs/Rx'
import { ScoreService } from "../../services/score";

@Component({
  selector: 'component-timer',
  templateUrl: 'timer.html'
})

export class TimerComponent implements AfterViewInit {
  constructor(
    public scoreService: ScoreService,
  ) {}

  timer: Observable<number>
  sub: Subscription

  ngAfterViewInit () {
    this.timer = Observable.timer(1, 1000)
    this.sub = this.timer.subscribe(t => this.scoreService.time = t)
  }

  ngOnDestroy () {
    this.sub.unsubscribe()
    console.log('Timer Destroyed.')
  }
}

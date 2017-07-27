import { Component, AfterViewInit } from '@angular/core'
import { Observable } from 'rxjs/Rx'

@Component({
  selector: 'component-timer',
  templateUrl: 'timer.html'
})

export class TimerComponent implements AfterViewInit {
  constructor() {}
  time = 0

  ngAfterViewInit () {
    const timer = Observable.timer(3000, 1000)
    timer.subscribe(t => this.time = t)
  }
}

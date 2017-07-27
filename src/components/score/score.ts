import { Component, OnInit } from '@angular/core'
import { ScoreService } from "../../services/score"

@Component({
  selector: 'component-score',
  templateUrl: 'score.html'
})

export class ScoreComponent implements OnInit {
  constructor(
    public scoreService: ScoreService
  ) {}

  ngOnInit () {}
}

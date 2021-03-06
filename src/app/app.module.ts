import { BrowserModule } from '@angular/platform-browser'
import { ErrorHandler, NgModule } from '@angular/core'
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular'
import { SplashScreen } from '@ionic-native/splash-screen'
import { StatusBar } from '@ionic-native/status-bar'
import { MyApp } from './app.component'
import { HomePage } from '../pages/home/home'
import { GamePage } from '../pages/game/game'
import { ResultPage } from './../pages/result/result'
import { MontapComponent } from './../components/montap/montap'
import { TimerComponent } from './../components/timer/timer'
import { ScoreComponent } from './../components/score/score'
import { BlocksComponent } from './../components/blocks/blocks'
import { GameService } from './../services/game'
import { ScoreService } from './../services/score'
import { Vibration } from '@ionic-native/vibration'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GamePage,
    ResultPage,
    MontapComponent,
    TimerComponent,
    ScoreComponent,
    BlocksComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GamePage,
    ResultPage,
    MontapComponent,
    TimerComponent,
    ScoreComponent,
    BlocksComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GameService,
    ScoreService,
    Vibration,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}

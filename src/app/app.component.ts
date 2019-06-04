import { Component } from '@angular/core';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserAgent } from '@ionic-native/user-agent/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'ngx-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private userAgent: UserAgent
  ) {
    this.initializeApp();
  }

  setUserAgent(): void {
    this.userAgent.set('SouthEvents')
      .catch((error: any) => console.error(error));
  }

  initializeApp(): void {
    this.platform.ready()
      .then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.setUserAgent();
      });
  }
}

import { Component } from '@angular/core';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserAgent } from '@ionic-native/user-agent/ngx';
import { Platform } from '@ionic/angular';
import { ConnectionStatus, NetworkService } from './services/network.service';
import { OfflineManagerService } from './services/offline-manager.service';

@Component({
  selector: 'ngx-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private userAgent: UserAgent,
    private networkService: NetworkService,
    private offlineManager: OfflineManagerService
  ) {
    this.initializeApp();
  }

  setUserAgent(): void {
    console.log('111111');
    this.userAgent.set('SouthEvents')
      .then(() => console.log('xxxxx'))
      .catch((error: any) => console.error(error));
  }

  initializeApp(): void {
    this.platform.ready()
      .then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.setUserAgent();
        this.networkService.onNetworkChange()
          .subscribe((status: ConnectionStatus) => {
            if (status === ConnectionStatus.Online) {
              this.offlineManager.checkForEvents()
              .subscribe();
            }
          });
      });
  }
}

import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localePl from '@angular/common/locales/pl';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { Calendar } from '@ionic-native/calendar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Network } from '@ionic-native/network/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRouter } from './app.router';

registerLocaleData(localePl);

@NgModule({
  declarations: [AppComponent],
  imports: [AppRouter, BrowserModule, HttpClientModule, IonicModule.forRoot(), IonicStorageModule.forRoot()],
  providers: [
    DatePipe,
    Geolocation,
    HTTP,
    Network,
    SplashScreen,
    StatusBar,
    Calendar,
    { provide: LOCALE_ID, useValue: 'pl' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

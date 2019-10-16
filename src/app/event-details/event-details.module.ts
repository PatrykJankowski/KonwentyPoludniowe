import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { IonicModule } from '@ionic/angular';

import { EventDetailsPage } from './event-details.page';
import { EventDetailsRouterModule } from './event-details.router';

@NgModule({
  imports: [
    CommonModule,
    EventDetailsRouterModule,
    IonicModule
  ],
  declarations: [EventDetailsPage],
  providers: [
    NativeGeocoder
  ]
})
export class EventDetailsModule {}

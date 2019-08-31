import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { EventDetailsPage } from './event-details.page';
import { EventDetailsRouterModule } from './event-details.router';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    EventDetailsRouterModule
  ],
  declarations: [EventDetailsPage]
})
export class EventDetailsModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventDetailsPage } from './event-details.page';
import { EventDetailsRouterModule } from './event-details.router.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    EventDetailsRouterModule
  ],
  declarations: [EventDetailsPage]
})
export class EventDetailsPageModule {}

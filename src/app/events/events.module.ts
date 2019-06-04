import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsPage } from './events.page';
import { HomeRoutingModule } from './events.router';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EventsPage]
})
export class EventsModule {}

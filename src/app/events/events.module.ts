import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilterPipe } from '../pipes/filter.pipe';
import { EventsPage } from './events.page';
import { EventsRouterModule } from './events.router';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    EventsRouterModule,
    ReactiveFormsModule
  ],
  declarations: [EventsPage, FilterPipe]
})
export class EventsModule {}

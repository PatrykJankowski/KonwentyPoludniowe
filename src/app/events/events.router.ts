import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventsPage } from './events.page';
import { EventsResolver } from './events.resolver';

const routes: Routes = [
  {
    path: '',
    component: EventsPage,
    resolve: { events: EventsResolver }
  },
  {
    path: 'event-details/:id',
    loadChildren: '../event-details/event-details.module#EventDetailsModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EventsRouterModule {}

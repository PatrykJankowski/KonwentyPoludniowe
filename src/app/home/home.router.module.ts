import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventDetailsResolverService } from '../event-details/event-details.resolver';
import { ResolverService } from '../services/resolver.service';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    resolve: { events: ResolverService }
  },
  {
    path: 'event-details/:id',
    loadChildren: '../event-details/event-details.module#EventDetailsPageModule',
    resolve: { eventDetails: EventDetailsResolverService }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule {}

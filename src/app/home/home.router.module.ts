import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResolverService } from '../services/resolver.service';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    resolve: { events: ResolverService },
    children: [
      {
        path: '/event-details/:id'
        // loadChildren: '../tab2/tab2.module#Tab2PageModule',
        // resolve: { eventDetails: EventDetailsResolverService },
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EventDetailsPageRoutingModule {}

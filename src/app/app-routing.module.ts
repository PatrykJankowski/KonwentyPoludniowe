import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EventDetailsResolverService } from './event-details/event-details.resolver';

const routes: Routes = [
  {
    path: '',
    loadChildren: './home/home.module#HomePageModule' },
  {
    path: 'event-details/:id',
    loadChildren: './event-details/event-details.module#EventDetailsPageModule',
    resolve: { eventDetails: EventDetailsResolverService }
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

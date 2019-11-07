import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EventDetails } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';

@Component({
  selector: 'ngx-event-details',
  templateUrl: 'event-details.page.html',
  styleUrls: ['event-details.page.scss']
})
export class EventDetailsPage {
  @ViewChild('map', {static: false}) public element: any;

  public readonly apiKey: string = 'xxx'; // todo: brac z configa
  public eventDetails: EventDetails = this.activatedRoute.snapshot.data.eventDetails;

  constructor(private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService) {}

  private addToFavourites(id: number): void {
    this.favouritesService
      .addToFavorites(id)
      .then();
  }

  private removeFromFavourites(id: number): void {
    this.favouritesService
      .removeFromFavourites(id)
      .then();
  }
}

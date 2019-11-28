import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Calendar } from '@ionic-native/calendar/ngx';

import { EventDetails } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';

@Component({
  selector: 'ngx-event-details',
  templateUrl: 'event-details.page.html',
  styleUrls: ['event-details.page.scss']
})
export class EventDetailsPage {
  public readonly apiKey: string = ''; // todo: brac z configa
  public eventDetails: EventDetails = this.activatedRoute.snapshot.data.eventDetails;

  constructor(private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService, private calendar: Calendar) {}

  public addToCalendar(): void {
    this.calendar
      .createEventInteractively(this.eventDetails.name, this.eventDetails.location, this.eventDetails.description, new Date(this.eventDetails.date_begin), new Date(this.eventDetails.date_end))
      .then();
  }

  public loadDefaultImage(event): void {
    event.target.src = '/assets/no-image.jpg';
  }

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

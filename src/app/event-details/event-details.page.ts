import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventDetails } from '../models/events.model';
import { FavouriteService } from '../services/favourites.service';

@Component({
  selector: 'ngx-event-details',
  templateUrl: 'event-details.page.html',
  styleUrls: ['event-details.page.scss']
})
export class EventDetailsPage implements OnInit {

  private eventDetails: EventDetails = this.activatedRoute.snapshot.data.eventDetails;

  constructor(private activatedRoute: ActivatedRoute, private favouritesService: FavouriteService) {}

  ngOnInit(): void {
    if (this.eventDetails.description) {
      this.eventDetails.description = this.eventDetails.description.replace(/<[^>]*>/g, '');
    }
    if (this.eventDetails.price) {
      this.eventDetails.price = this.eventDetails.price.replace(/<[^>]*>/g, '');
    }
  }

  addToFavourites(id: number): void {
    this.favouritesService
      .addToFavorites(id)
      .then();
  }

  removeFromFavourites(id: number): void {
    this.favouritesService
      .removeFromFavourites(id)
      .then();
  }
}

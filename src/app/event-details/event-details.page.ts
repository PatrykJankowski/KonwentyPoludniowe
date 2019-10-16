import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

import { EventDetails } from '@models/event.model';
import { FavouriteService } from '@services/favourites.service';

@Component({
  selector: 'ngx-event-details',
  templateUrl: 'event-details.page.html',
  styleUrls: ['event-details.page.scss']
})
export class EventDetailsPage implements OnInit {
  @ViewChild('map', {static: false}) public element: any;

  public readonly apiKey: string = 'AIzaSyABDqSFgbPT0iBn80-MJPFm5GmUiI38pFw';
  public eventDetails: EventDetails = this.activatedRoute.snapshot.data.eventDetails;
  public latitude: number;
  public longitude: number;

  constructor(private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService, private nativeGeocoder: NativeGeocoder) {}

  public ngOnInit(): void {
    if (this.eventDetails.description) {
      this.eventDetails.description = this.eventDetails.description.replace(/<[^>]*>/g, '');
    }
    if (this.eventDetails.price) {
      this.eventDetails.price = this.eventDetails.price.replace(/<[^>]*>/g, '');
    }
    this.setCoordinates();
  }

  private setCoordinates(): void {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    };

    this.nativeGeocoder.forwardGeocode(this.eventDetails.address, options)
      .then((coordinates: Array<NativeGeocoderResult>) => {
        this.latitude = parseFloat(coordinates[0].latitude);
        this.longitude = parseFloat(coordinates[0].longitude);
      });
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsEvent} from '@ionic-native/google-maps/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

import { EventDetails } from '../models/event.model';
import { FavouriteService } from '../services/favourites.service';

@Component({
  selector: 'ngx-event-details',
  templateUrl: 'event-details.page.html',
  styleUrls: ['event-details.page.scss']
})
export class EventDetailsPage implements OnInit {
  public eventDetails: EventDetails = this.activatedRoute.snapshot.data.eventDetails;
  private map: GoogleMap;

  constructor(private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService, private nativeGeocoder: NativeGeocoder) {}

  public ngOnInit(): void {
    if (this.eventDetails.description) {
      this.eventDetails.description = this.eventDetails.description.replace(/<[^>]*>/g, '');
    }
    if (this.eventDetails.price) {
      this.eventDetails.price = this.eventDetails.price.replace(/<[^>]*>/g, '');
    }
    this.loadMap();
  }

  private loadMap(): void {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 2
    };

    this.nativeGeocoder.forwardGeocode(this.eventDetails.address, options)
      .then((coordinates: Array<NativeGeocoderResult>) => {
        const latitude: number = parseFloat(coordinates[0].latitude);
        const longitude: number = parseFloat(coordinates[0].longitude);
        
        const mapOptions: GoogleMapOptions = {
          camera: {
            target: {
              lat: latitude,
              lng: longitude
            },
            zoom: 10,
            tilt: 30
          }
        };

        this.map = GoogleMaps.create('map', mapOptions);
        this.createPin(latitude, longitude)
          .then();
      })
      .catch((error: any) => console.log(error));
  }

  private createPin(latitude: number, longitude: number): Promise<void> {
    return this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.map.addMarker({
          title: this.eventDetails.name,
          icon: '#6C5477',
          animation: 'DROP',
          position: {
            lat: latitude,
            lng: longitude
          }
        })
          .then();
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

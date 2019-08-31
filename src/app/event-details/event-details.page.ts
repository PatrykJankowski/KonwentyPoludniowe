import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleMapOptions } from '@ionic-native/google-maps';
import { GoogleMap, GoogleMaps, GoogleMapsEvent, Marker } from '@ionic-native/google-maps/ngx';
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

  constructor(private activatedRoute: ActivatedRoute, public favouritesService: FavouriteService) {}

  public ngOnInit(): void {
    if (this.eventDetails.description) {
      this.eventDetails.description = this.eventDetails.description.replace(/<[^>]*>/g, '');
    }
    if (this.eventDetails.price) {
      this.eventDetails.price = this.eventDetails.price.replace(/<[^>]*>/g, '');
    }
  }

  public ionViewDidLoad(): void {
    this.loadMap();
  }

  private loadMap(): void {
    const mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    const marker: Marker = this.map.addMarkerSync({
      title: 'Ionic',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: 43.0741904,
        lng: -89.3809802
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK)
      .subscribe(() => {
        alert('clicked');
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

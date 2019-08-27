import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

declare var google: any;

@Component({
  selector: 'ngx-events-map',
  templateUrl: './events-map.page.html',
  styleUrls: ['./events-map.page.scss']
})
export class EventsMapPage implements OnInit {
  @ViewChild('Map', { static: false }) mapElement: ElementRef;
  map: any;
  mapOptions: any;
  location2 = {lat: 51.8917325, lng: 16.1992451};
  markerOptions: any = {position: 51.8917325, map: 16.1992451, title: 0};
  marker: any;
  apiKey: any = 'AIzaSyABDqSFgbPT0iBn80-MJPFm5GmUiI38pFw';

  xxx: Array<any>;

  constructor(/* public zone: NgZone, */private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {

    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    // load google map script dynamically
    const script = document.createElement('script');
    script.id = 'googleMap';
    script.src = `https://maps.googleapinpm installs.com/maps/api/js?key=${this.apiKey}`;
    document.head.appendChild(script);

    // Get Current location
    /* this.geolocation.getCurrentPosition()
       .then(position => {
         this.location2.lat = position.coords.latitude;
         this.location2.lng = position.coords.longitude;
       });*/


    this.nativeGeocoder.forwardGeocode('02-353 Warszawa', options)
      .then((result: Array<NativeGeocoderResult>) => { // this.xxx = result;
        console.log(result);
        for(let key in result) {
          this.xxx.push(result[key]);
        }

        console.log(`The coordinates are latitude='${result[0].latitude} and longitude=${result[0].longitude})`);
        this.location2.lat = parseInt(result[0].latitude, 7);
        this.location2.lng = parseInt(result[0].longitude, 7);
      })
      .catch((error: any) => console.log(error));


    // Map options
    this.mapOptions = {
      center: this.location2,
      zoom: 12,
      mapTypeControl: false
    };
    setTimeout(() => {
      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);

      // Marker Options*/
      this.markerOptions.position = this.location2;
      this.markerOptions.map = this.map;
      this.markerOptions.title = 'My Location';
      this.marker = new google.maps.Marker(this.markerOptions);


      const features = [
        {
          position: new google.maps.LatLng(54.372158, 18.638306),
          type: 'info'
        }, {
          position: new google.maps.LatLng(50.049683, 19.944544),
          type: 'info'
        }, {
          position: new google.maps.LatLng(52.049683, 18.944544),
          type: 'info'
        }, {
          position: new google.maps.LatLng(53.049683, 19.544544),
          type: 'info'
        }, {
          position: new google.maps.LatLng(50.049683, 18.944544),
          type: 'info'
        }, {
          position: new google.maps.LatLng(49.049683, 19.944544),
          type: 'info'
        }, {
          position: new google.maps.LatLng(50.409683, 19.944544),
          type: 'parking'
        }, {
          position: new google.maps.LatLng(51.549683, 20.944544),
          type: 'parking'
        }
      ];

      const iconBase =
        'https://developers.google.com/maps/documentation/javascript/examples/full/images/';

      const icons = {
        parking: {
          icon: iconBase + 'parking_lot_maps.png'
        },
        library: {
          icon: iconBase + 'library_maps.png'
        },
        info: {
          icon: iconBase + 'info-i_maps.png'
        }
      };

      // Create markers.
      for(let i = 0; i < features.length; i++) {
        const marker = new google.maps.Marker({
          position: features[i].position,
          icon: icons[features[i].type].icon,
          map: this.map
        });
      }

    }, 3000);
  }

  ngOnInit(): void {
  }
}

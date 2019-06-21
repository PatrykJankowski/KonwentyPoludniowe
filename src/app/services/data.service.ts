import { Injectable } from '@angular/core';

import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';

import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Events } from '../models/events.model';
import { ConnectionStatus } from '../models/network';
import { FavouriteService } from './favourites.service';
import { NetworkService } from './network.service';

const API_STORAGE_KEY = 'KK';
const API_URL = 'https://konwenty-poludniowe.pl/events_app.php';
const API_AUTH = {'User-Agent': 'SouthEvents'};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private nativeHttp: HTTP, private storage: Storage, private networkService: NetworkService, private favouritesService: FavouriteService) {}

  filterEvents(events, category, location, date, favouritesOnly, search): Array<Events> {

      return events.filter((event: Events) => (
        event.event_type.toLowerCase()
          .indexOf(category.toLowerCase()) > -1 &&
        event.location.toLowerCase()
          .indexOf(location.toLowerCase()) > -1 &&
        event.date_begin.toLowerCase()
          .includes(date.toLowerCase()) === true) &&

        (!favouritesOnly || this.favouritesService.isFavourite(event.id)) &&

        (event.name.toLowerCase()
            .indexOf(search.toLowerCase()) > -1 ||
          event.event_type.toLowerCase()
            .indexOf(search.toLowerCase()) > -1 ||
          event.location.toLowerCase()
            .indexOf(search.toLowerCase()) > -1
        ));
  }

  // TODO: Zapisac eventsdetails w localstorage
  getEvents(forceRefresh: Boolean = false): Observable<any> {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
      return this.getLocalData('events');
    }

    return from(this.nativeHttp.get(API_URL, {}, API_AUTH))
      .pipe(map(events => JSON.parse(events.data)))
      .pipe(tap(events => this.setLocalData('events', events)));
  }

  getEventDetails(id: number): Observable<HTTPResponse> {
    return from(this.nativeHttp.get(`${API_URL}?id=${id}`, {}, API_AUTH));
  }

  private setLocalData(key: String, data: Events): void {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }

  private getLocalData(key): Observable<Events> {
    return from(this.storage.get(`${API_STORAGE_KEY}-${key}`));
  }
}

import { Injectable } from '@angular/core';

import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';

import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Events } from '../models/events.model';
import { ConnectionStatus } from '../models/network';
import { NetworkService } from './network.service';

const API_STORAGE_KEY = 'KK';
const API_URL = 'https://konwenty-poludniowe.pl/events_app.php';
const API_AUTH = {'User-Agent': 'SouthEvents'};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private nativeHttp: HTTP, private storage: Storage, private networkService: NetworkService) {}

  filterEvents(events, category, location, date, search): Array<Events> {
    const todayDate = new Date();
    let futureEvents = false;

    if (!date) {
      futureEvents = true;
    }

    return events.filter((event: Events) => (
      event.event_type.indexOf(category) > -1 &&
      event.location.indexOf(location) > -1 &&
      ((futureEvents && new Date(event.date_end) >= todayDate) || (!futureEvents && (event.date_begin.includes(date) || event.date_end.includes(date))))) &&

      (event.name
          .toLowerCase()
          .indexOf(search.toLowerCase()) > -1
      ));
  }

// TODO: Zapisac eventsdetails w localstorage
  getEvents(forceRefresh: Boolean = false, year = ''): Observable<any> {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
      return this.getLocalData(`events${year}`);
    }

    return from(this.nativeHttp.get(`${API_URL}?year=${year}`, {}, API_AUTH))
      .pipe(map(events => JSON.parse(events.data)))
      .pipe(tap(events => this.setLocalData(`events${year}`, events)));
  }

  getEventDetails(id: number): Observable<HTTPResponse> {
    return from(this.nativeHttp.get(`${API_URL}?id=${id}`, {}, API_AUTH))
      .pipe(map(eventDetails => JSON.parse(eventDetails.data)[0]));
  }

  private setLocalData(key: string, data): void {
    this.storage
      .set(`${API_STORAGE_KEY}-${key}`, data)
      .then();
  }

  private getLocalData(key): Observable<Events> {
    return from(this.storage.get(`${API_STORAGE_KEY}-${key}`));
  }

}

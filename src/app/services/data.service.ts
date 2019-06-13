import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { from, Observable } from 'rxjs';

import { tap } from 'rxjs/operators';
import { Events } from '../models/events.model';
import { ConnectionStatus } from '../models/network';
import { FavouriteService } from './favourites.service';
import { NetworkService } from './network.service';

const API_STORAGE_KEY = 'KK';
const API_URL = 'https://konwenty-poludniowe.pl/events_app.php';

@Injectable({
  providedIn: 'root'
})
export class DataService {
    events: Observable<Array<Events>>;

    private response: any;

    constructor(private http: HttpClient, private storage: Storage, private networkService: NetworkService, private favouritesService: FavouriteService) {
        this.events = this.getData();
    }

    filterEvents(events, category, location, date, favouritesOnly): Array<Events> {
        if (events) {
            return events.filter((event: Events) =>
              (event.event_type.toLowerCase()
                .indexOf(category.toLowerCase()) > -1 && event.location.toLowerCase()
                .indexOf(location.toLowerCase()) > -1 && event.date_begin.toLowerCase()
                .includes(date.toLowerCase()) === true) && (!favouritesOnly || this.favouritesService.isFavourite(event.id)));
            }
    }

    searchEvents(events, search): Array<Events> {
        if (events) {
            return events.filter((event: Events) => (
              event.name.toLowerCase()
                .indexOf(search.toLowerCase()) > -1 ||
              event.event_type.toLowerCase()
                .indexOf(search.toLowerCase()) > -1 ||
              event.location.toLowerCase()
                .indexOf(search.toLowerCase()) > -1));
        }
    }

    // Dwa razy sie wywołuje???????????????????????????????????????????
    getData(forceRefresh = true): Observable<any> {
        if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
            console.log('OFLINE');

            return from(this.getLocalData('events'));
        }

        return this.response = this.http.get(API_URL)
          .pipe(tap(events => this.setLocalData('events', events)));
    }

    getDetails(id: number): Observable<any> {
        const apiURL = `${API_URL}?id=${id}`;
        // const apiURL = `/assets/data2.json?id=${id}`;

        return this.response = this.http.get(apiURL);
    }

    private setLocalData(key, data): void {
        this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
    }

    private getLocalData(key): Promise<string> {
        return this.storage.get(`${API_STORAGE_KEY}-${key}`);
    }
}

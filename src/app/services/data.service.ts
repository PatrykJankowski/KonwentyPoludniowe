import { Injectable } from '@angular/core';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';

import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
    private events: Observable<Array<Events>>;
    private response: Observable<any>;

    constructor(private nativeHttp: HTTP, private storage: Storage, private networkService: NetworkService, private favouritesService: FavouriteService) {}

    filterEvents(events, category, location, date, favouritesOnly): Array<Events> {
        if (events) {
            let x = events;
            if (events.data) {
                x = JSON.parse(events.data);
            }

            return x.filter((event: Events) =>
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
    getEvents(forceRefresh = false): Observable<any> {
        console.log('Dwa razy sie wywołuje???????????????????????????????????????????');
        if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
            return from(this.getLocalData('events'));
        }

        return this.response = from(this.nativeHttp.get(API_URL, {}, API_AUTH))
          .pipe(tap(events => this.setLocalData('events', JSON.parse(events.data))));
    }

    getEventDetails(id: number): Observable<any> {
        return this.response = from(this.nativeHttp.get(`${API_URL}?id=${id}`, {}, API_AUTH));
    }

    private setLocalData(key, data): void {
        this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
    }

    private getLocalData(key): Promise<string> {
        return this.storage.get(`${API_STORAGE_KEY}-${key}`);
    }
}

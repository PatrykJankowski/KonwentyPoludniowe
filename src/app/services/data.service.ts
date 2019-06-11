import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { from, Observable } from 'rxjs';

import { tap } from 'rxjs/operators';
import { Events } from '../models/events.model';
import { ConnectionStatus, NetworkService } from './network.service';

const API_STORAGE_KEY = 'specialkey';
const API_URL = 'https://konwenty-poludniowe.pl/events_app.php';

@Injectable({
  providedIn: 'root'
})
export class DataService {
    events: Observable<Array<Events>>;

    private response: any;

    constructor(private http: HttpClient, private networkService: NetworkService, private storage: Storage) {
        this.events = this.getData();

        this.storage.get('favoriteEvents')
          .then(x => console.log(x));


    }

    filterEvents(events, category, location, date): Array<Events> {
        return events.filter((event: Events) =>
          (event.event_type.toLowerCase()
            .indexOf(category.toLowerCase()) > -1 && event.location.toLowerCase()
            .indexOf(location.toLowerCase()) > -1 && event.date_begin.toLowerCase()
            .includes(date.toLowerCase()) === true));
    }

    searchEvents(events, search): Array<Events> {
        return events.filter((event: Events) => (
          event.name.toLowerCase()
            .indexOf(search.toLowerCase()) > -1 ||
          event.event_type.toLowerCase()
            .indexOf(search.toLowerCase()) > -1 ||
          event.location.toLowerCase()
            .indexOf(search.toLowerCase()) > -1));
    }

//    filterByDate(events, category, date) {
//        return events.filter((event: IEvents) => {
//           return (event.event_type.toLowerCase().indexOf(category.toLowerCase()) > -1 ||
//                event.date_begin.toLowerCase().indexOf(date.toLowerCase()) > -1);
//
//        });
//    }

    // Dwa razy sie wywołuje???????????????????????????????????????????
    getData(forceRefresh = false): Observable<any> {

        if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
            console.log('OOOOFILNEEEEE');

            return from(this.getLocalData('events'));
        }

        return this.response = this.http.get('/assets/data.json')
          .pipe(tap(events => this.setLocalData('events', events)));
    }

    getDetails(id: number): Observable<any> {
        // const apiURL = `https://konwenty-poludniowe.pl/events_app.php?id=${id}`;
        const apiURL = `/assets/data2.json?id=${id}`;

        return this.response = this.http.get(apiURL);
    }

    setFav(id): void {
        this.setLocalData('events-fav', id);
    }

    private setLocalData(key, data): void {
        this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
    }

    private getLocalData(key): Promise<string> {
        return this.storage.get(`${API_STORAGE_KEY}-${key}`);
    }
}

import { Injectable } from '@angular/core';

import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { from, Observable } from 'rxjs';
import {catchError, map, mergeMap, tap} from 'rxjs/operators';

import { Event } from '@models/event.model';
import { ConnectionStatus } from '@models/network';
import { NetworkService } from '@services/network.service';
import {Platform} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly API_STORAGE_KEY: string = 'KK';
  private readonly API_URL: string = 'https://konwenty-poludniowe.pl/events_app.php';
  private readonly API_AUTH: object = {'User-Agent': 'SouthEvents'};

  constructor(private nativeHttp: HTTP, private storage: Storage, private networkService: NetworkService, private platform: Platform) {}

  public filterEvents(events: Array<Event>, category: string, location: string, date: string, search: string): Array<Event> {

    if (events === null) {
      return [];
    }

    const todayDate: Date = new Date();
    let futureEvents: boolean = false;

    if (!date) {
      futureEvents = true;
    }

    return events.filter((event: Event) => (
      event.event_type.indexOf(category) > -1 &&
      event.location.indexOf(location) > -1 &&
      ((futureEvents && new Date(event.date_end) >= todayDate) || (!futureEvents && (event.date_begin.includes(date) || event.date_end.includes(date))))) &&

      (event.name
          .toLowerCase()
          .indexOf(search.toLowerCase()) > -1
      ));
  }

// TODO: Zapisac eventsdetails w localstorage
  public getEvents(year: string = ''): Observable<any> {
    return from(this.platform.ready())
      .pipe(mergeMap(() => {
        return from(this.nativeHttp.get(`${this.API_URL}?year=${year}`, {}, this.API_AUTH))
          .pipe(
            map((events: HTTPResponse) => JSON.parse(events.data)),
            tap((event: Event) => this.setLocalData(`events${year}`, event)),
            catchError((e) => {
              console.log('eeeeeee');
              if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
                return this.getLocalData(`events${year}`); // todo if null then [] zamaist  === null wyzej ?
              }
            })
          );
      }));
  }

  public getEventDetails(id: number): Observable<HTTPResponse> {
    return from(this.nativeHttp.get(`${this.API_URL}?id=${id}`, {}, this.API_AUTH))
      .pipe(map((eventDetails: HTTPResponse) => JSON.parse(eventDetails.data)[0]));
  }

  private setLocalData(key: string, data: Event): void {
    this.storage
      .set(`${this.API_STORAGE_KEY}-${key}`, data)
      .then();
  }

  private getLocalData(key: string): Observable<any> {
    return from(this.storage.get(`${this.API_STORAGE_KEY}-${key}`));
  }
}

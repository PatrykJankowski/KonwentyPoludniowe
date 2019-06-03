import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Events } from '../models/events.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
    events: Observable<Array<Events>>;

    private response: any;

    constructor(private http: HttpClient) {
        this.events = this.getData();
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

    getData(): Observable<any> {
      const apiURL = 'https://konwenty-poludniowe.pl/events_app.php';

      return this.response = this.http.get(apiURL);
    }

    getDetails(id: number): Observable<any> {
        const apiURL = 'https://konwenty-poludniowe.pl/events_app.php?id=' + id;

        return this.response = this.http.get(apiURL);
    }
}

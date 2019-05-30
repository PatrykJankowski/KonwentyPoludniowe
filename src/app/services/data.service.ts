import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IEvents } from '../models/events.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

    private response: any;
    public events: Observable<IEvents[]>; // type IEvents ??

    constructor(private http: HttpClient) {
      this.events = this.getData();
    }

    filterItems(data, searchTerm) {
        return data.filter((event: IEvents) => {
            return (event.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
                event.event_type.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        });
    }

    filterByCategory(events, category, date) {
        return events.filter((event: IEvents) => {
            return (event.event_type.toLowerCase().indexOf(category.toLowerCase()) > -1 &&
                event.date_begin.toLowerCase().indexOf(date.toLowerCase()) > -1);
        });
    }

/*    filterByDate(events, category, date) {
        return events.filter((event: IEvents) => {
            return (event.event_type.toLowerCase().indexOf(category.toLowerCase()) > -1 ||
                event.date_begin.toLowerCase().indexOf(date.toLowerCase()) > -1);

        });
    }*/

    getData(): Observable<any> {
      const apiURL = 'https://konwenty-poludniowe.pl/events_app.php';
      return this.response = this.http.get(apiURL);
    }

/*    getFilteredData(term: string): Observable<IEvents[]> {
        return this.response.pipe(
            map((events: IEvents[]) => events
                .filter(event => {
                    return (event.name.toLowerCase().indexOf(term.toLowerCase()) > -1 || event.event_type.toLowerCase().indexOf(term.toLowerCase()) > -1 ? event : null);
                })
            )
    );
    }*/
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { IEvents } from '../models/events.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private response: any;

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {

      const apiURL = 'https://konwenty-poludniowe.pl/events_app.php';

      return this.response = this.http.get(apiURL);
  }

    getFilteredData(term: string): Observable<IEvents[]> {
        return this.response.pipe(
            map((events: IEvents[]) => events
                .filter(event => {
                    return (event.name.toLowerCase().indexOf(term.toLowerCase()) > -1 || event.event_type.toLowerCase().indexOf(term.toLowerCase()) > -1 ? event : null);
                })
            )
    );
  }

}

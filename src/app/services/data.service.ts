import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { IEvents } from '../models/events.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  getData(term: string): Observable<IEvents[]> {

      const apiURL = 'https://konwenty-poludniowe.pl/events_app.php';

      return this.http.get(apiURL).pipe(
        map((events: IEvents[]) => events
            /*.filter(event => {
                return (event.name.toLowerCase().indexOf(term.toLowerCase()) > -1 || event.event_type.toLowerCase().indexOf(term.toLowerCase()) > -1 ? event : null);
            })*/
        )
    );
  }
}

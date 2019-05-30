import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

import { IEvents } from '../models/events.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  private loading = false;
  private events$: Observable<IEvents[]>;
  private searchField: FormControl;

  private data: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.data = this.route.data.pipe(map(response => response.events));
    this.searchField = new FormControl();

    this.filterData('');

    this.events$ = this.searchField.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        // tap(() => (this.loading = true)),
        switchMap(term => this.filterData(term)),
        // tap(() => (this.loading = false))
    );
  }

  filterData(term: string): Observable<IEvents[]> {
    return this.data.pipe(
        map((events: IEvents[]) => events
            .filter(event => {
              return (event.name.toLowerCase().indexOf(term.toLowerCase()) > -1 || event.event_type.toLowerCase().indexOf(term.toLowerCase()) > -1 ? event : null);
            })
        )
    );
  }
}

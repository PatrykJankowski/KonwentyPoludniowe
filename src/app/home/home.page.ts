import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';

import { DataService } from '../services/data.service';
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

  constructor(private events: DataService) {}

  ngOnInit() {
    this.searchField = new FormControl();

    this.events$ = this.searchField.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        switchMap(term => this.events.getData(term)),
        tap(() => (this.loading = false))
    );
  }
}

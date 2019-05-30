import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { DataService } from '../services/data.service';
import {IEvents} from '../models/events.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  private events: IEvents[];
  private items: any;
  private searchField: FormControl;
  private categoryFilter: FormControl;
  private dateFilter: FormControl;
  private searchTermTmp: IEvents;

  private category = '';
  private date = '';

  // private searching: any = false;
  // private loading = false;


  constructor(private route: ActivatedRoute, public dataService: DataService) {}

  ngOnInit() {
    this.events = this.route.snapshot.data.events;
    this.setFilteredItems(this.category, this.date);

    this.searchField = new FormControl();
    this.categoryFilter = new FormControl();
    this.dateFilter = new FormControl();

    this.searchField.valueChanges.pipe(debounceTime(100)).subscribe(search => {
      // this.searching = false;
      this.setFilteredItems(this.category, this.date);
    });

    this.categoryFilter.valueChanges.pipe(debounceTime(100)).subscribe(search => {
      this.category = search;
      this.events = this.route.snapshot.data.events;
      this.events = this.dataService.filterByCategory(this.events, this.category, this.date);
      this.items = this.events;
      this.setFilteredItems(this.category, this.date);
    });


    this.dateFilter.valueChanges.pipe(debounceTime(100)).subscribe(search => {
      this.date = search;
      this.events = this.route.snapshot.data.events;
      this.events = this.dataService.filterByCategory(this.events, this.category, this.date);
      this.items = this.events;
      // this.setFilteredItems(this.searchTermTmp);
    });


  }

  setFilteredItems(category, date) {
    this.items = this.dataService.filterByCategory(this.events, category, date);
    // this.searchTermTmp = searchTerm;
  }


  /*onSearchInput() {
      this.searching = true;
   }*/

  /*
    this.events$ = this.categoryFilter.valueChanges.pipe(startWith(''),
        distinctUntilChanged(),
        // tap(() => (this.loading = true)),
        switchMap(term => this.filterData(term)),
        // tap(() => (this.loading = false))
    );

*/

/*  filterData(term: string): Observable<IEvents[]> {

    console.log(this.data);

    return this.data.filter(event => {
      console.log(event.name);
      return (event.name.toLowerCase().indexOf(term.toLowerCase()) > -1 || event.event_type.toLowerCase().indexOf(term.toLowerCase()) > -1 ? event : null);
            });

  }*/
}

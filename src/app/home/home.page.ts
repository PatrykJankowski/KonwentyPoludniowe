import { Component, OnInit} from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { DataService } from '../services/data.service';
import { IEvents} from '../models/events.model';

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
  private locationFilter: FormControl;
  private dateFilter: FormControl;

  private searchingTerm = '';
  private category = '';
  private location = '';
  private date = this.datePipe.transform(new Date(), 'yyyy-MM');

  private categories = [];
  private locations = [];

  // private searching: any = false;
  // private loading = false;

  customPickerOptions: any;

  constructor(private route: ActivatedRoute, public dataService: DataService, public datePipe: DatePipe) {}

  ngOnInit() {
    this.events = this.route.snapshot.data.events;

    this.setFilters();
    this.setFilteredItems(this.category, this.location, this.date);

        /*    this.customPickerOptions = {
              buttons: [
                {
                  text: 'Potwierdź',
                  handler: () => console.log('Clicked Save!')
                },
                {
                text: 'Anuluj',
                handler: () => {
                  return false;
                }
              }]
            };*/

    this.searchField = new FormControl();
    this.categoryFilter = new FormControl();
    this.locationFilter = new FormControl();
    this.dateFilter = new FormControl();

    this.searchField.valueChanges.subscribe(search => {
      // this.searching = false;
      this.searchingTerm = search;
      this.setSearchededItems(this.searchingTerm);
    });

    this.categoryFilter.valueChanges.subscribe(search => {
      this.category = search;
      this.events = this.route.snapshot.data.events;
      this.items = this.events = this.dataService.filterEvents(this.events, this.category, this.location, this.date);
      this.setFilteredItems(this.category, this.location, this.date);
      this.setSearchededItems(this.searchingTerm);
    });

    this.locationFilter.valueChanges.subscribe(search => {
      this.location = search;
      this.events = this.route.snapshot.data.events;
      this.items = this.events = this.dataService.filterEvents(this.events, this.category, this.location, this.date);
      this.setFilteredItems(this.category, this.location, this.date);
      this.setSearchededItems(this.searchingTerm);
    });

    this.dateFilter.valueChanges.subscribe(search => {
      this.date = formatDate(search, 'yyyy-MM', 'pl');
      this.events = this.route.snapshot.data.events;
      this.items = this.events = this.dataService.filterEvents(this.events, this.category, this.location, this.date);
      this.setFilteredItems(this.category, this.location, this.date);
      this.setSearchededItems(this.searchingTerm);
    });
}

  setFilters() {
    for (let i = 0; i < this.events.length; i++) {
      const category = this.events[i].event_type;
      const location = this.events[i].location;
      if (this.categories.indexOf(category) === -1) { this.categories.push(category); }
      if (this.locations.indexOf(location) === -1) { this.locations.push(location); }
    }
  }

  setFilteredItems(category, location, date) {
    this.items = this.dataService.filterEvents(this.events, category, location, date);
  }

  setSearchededItems(search) {
    this.items = this.dataService.searchEvents(this.events, search);
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

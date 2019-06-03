import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Events } from '../models/events.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'ngx-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  private events: Array<Events>;
  private items: Array<Events>;
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

  constructor(private route: ActivatedRoute, public dataService: DataService, public datePipe: DatePipe) {}

  ngOnInit(): void {
    this.events = this.route.snapshot.data.events;

    this.setFilters();
    this.setFilteredData();

    this.searchField = new FormControl();
    this.categoryFilter = new FormControl();
    this.locationFilter = new FormControl();
    this.dateFilter = new FormControl();

    this.searchField.valueChanges.subscribe(search => {
      this.setSearchedItems(search);
    });

    this.categoryFilter.valueChanges.subscribe(search => {
      this.category = search;
      this.setFilteredData();
    });

    this.locationFilter.valueChanges.subscribe(search => {
      this.location = search;
      this.setFilteredData();
    });

    this.dateFilter.valueChanges.subscribe(search => {
      this.date = formatDate(search, 'yyyy-MM', 'pl');
      this.setFilteredData();
    });
}

  setFilters(): void {
    for (const event of this.events) {
      const category = event.event_type;
      const location = event.location;
      if (this.categories.indexOf(category) === -1) { this.categories.push(category); }
      if (this.locations.indexOf(location) === -1) { this.locations.push(location); }
    }
  }

  setSearchedItems(search): void {
    this.searchingTerm = search;
    this.items = this.dataService.searchEvents(this.events, this.searchingTerm);
  }

  setFilteredData(): void {
    this.events = this.route.snapshot.data.events;
    this.items = this.events = this.dataService.filterEvents(this.events, this.category, this.location, this.date);
    this.setSearchedItems(this.searchingTerm);
  }
}

import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Platform } from '@ionic/angular';
import { Events } from '../models/events.model';
import { DataService } from '../services/data.service';
import { FavouriteService } from '../services/favourites.service';

@Component({
  selector: 'ngx-home',
  templateUrl: 'events.page.html',
  styleUrls: ['events.page.scss']
})
export class EventsPage implements OnInit {
  private events: Array<Events> = this.route.snapshot.data.events;
  private filteredEvents: Array<Events>;

  private searchField: FormControl;
  private categoryFilter: FormControl;
  private locationFilter: FormControl;
  private dateFilter: FormControl;

  private category = '';
  private location = '';
  private date = '';
  private searchingTerm = '';

  private categories = [];
  private locations = [];
  private dates = [];

  constructor(private route: ActivatedRoute,
              private platform: Platform,
              private datePipe: DatePipe,
              private dataService: DataService,
              private favouritesService: FavouriteService) {}

  ngOnInit(): void {

    this.platform.ready()
      .then(() => {
        this.initFilters();
        this.setFilteredData();
      });

    this.searchField = new FormControl();
    this.categoryFilter = new FormControl();
    this.locationFilter = new FormControl();
    this.dateFilter = new FormControl();

    this.searchField.valueChanges.subscribe(searchingTerm => {
      this.setSearchingTerm(searchingTerm);
      this.setFilteredData();
    });

    this.categoryFilter.valueChanges.subscribe(category => {
      this.setCategory(category);
      this.setFilteredData();
    });

    this.locationFilter.valueChanges.subscribe(location => {
      this.setLocation(location);
      this.setFilteredData();
    });

    this.dateFilter.valueChanges.subscribe(date => {
      this.setDate(date);
      this.setFilteredData();
    });
}

  ionViewWillEnter(): void {
    if (this.favouritesService.getFavouritesOnlyFlag()) {
      this.setFilteredData();
    }
  }

  favouritesFilter(): any {
    this.favouritesService.setFavouritesOnlyFlag();
    this.setFilteredData();
  }

  initFilters(): void {
    if (this.events) {
      for (const event of this.events) {
        const category = event.event_type;
        const location = event.location;
        const date = formatDate(event.date_begin, 'yyyy', 'pl');

        if (this.categories.indexOf(category) === -1) { this.categories.push(category); }
        if (this.locations.indexOf(location) === -1) { this.locations.push(location); }
        if (this.dates.indexOf(date) === -1) { this.dates.push(date); }
      }
      this.categories.sort();
      this.locations.sort();
      this.dates.sort();
    }
  }

  addToFavourites(id): void {
    if (!this.favouritesService.isFavourite(id)) {
      this.favouritesService.addToFavorites(id)
        .then(favourites => {
          this.setFilteredData();
        });
    }
  }

  removeFromFavourites(id): void {
    if (this.favouritesService.isFavourite(id)) {
      this.favouritesService.removeFromFavourites(id)
        .then(favourites => {
          this.setFilteredData();
        });
    }
  }

  getFilteredEvents(): any {
    if (this.favouritesService.getFavouritesOnlyFlag()) {
      return this.favouritesService.getFavouritesEvents(this.events);
    }

    return this.dataService.filterEvents(this.events, this.category, this.location, this.date, this.searchingTerm);
  }

  setFilteredData(): void {
    this.filteredEvents = this.getFilteredEvents();
  }

  setCategory(category): void {
    this.category = category;
  }

  setLocation(location): void {
    this.location = location;
  }

  setDate(date): void {
    this.date = date;
  }

  setSearchingTerm(searchingTerm): void {
    this.searchingTerm = searchingTerm;
  }

}

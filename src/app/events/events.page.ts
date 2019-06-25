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
  private favouritesOnly = false;
  private searchingTerm = '';

  private categories = [];
  private locations = [];
  private dates = [];
  private favourites = [];

  constructor(private route: ActivatedRoute,
              private plt: Platform,
              private datePipe: DatePipe,
              private dataService: DataService,
              private favoriteService: FavouriteService) {}

  ngOnInit(): void {

    this.plt.ready()
      .then(() => {
        this.initFilters();
        this.setFilteredData();
        this.setFavourites();
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

  favouritesFilter(): any {
    this.favouritesOnly = !this.favouritesOnly;
    this.filterFavourites();
  }

  loadData(refresh = false, refresher?): void {
    this.dataService.getEvents(refresh)
      .subscribe(res => {
        this.events = res;
        if (refresher) {
          refresher.target.complete();
        }
      });
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

  isFavourite(id): Boolean {
    if (!this.favourites) {
      return false;
    }

    for (let i = 0; i < this.favourites.length; i++) {
      if (this.favourites[i] === id) {
        return true;
      }
    }

    return false;
  }

  addToFavourites(id): void {
    if (!this.isFavourite(id)) {
      this.favoriteService.addToFavorites(id)
        .then(favourites => {
          this.favourites = favourites;
          this.setFilteredData();
        });
    }
  }

  removeFromFavourites(id): void {
    if (this.isFavourite(id)) {
      this.favoriteService.removeFromFavourites(id)
        .then(favourites => {
          this.favourites = favourites;
          this.setFilteredData();
        });
    }
  }

  filterFavourites(): void {
    this.filteredEvents = this.getFavourites();
  }

  getFilteredEvents(): any {
    return this.dataService.filterEvents(this.events, this.category, this.location, this.date, this.searchingTerm);
  }

  getFavourites(): any {
    if (this.favouritesOnly) {
      return this.dataService.getFavouritesEvents(this.events);
    }

    return this.getFilteredEvents();
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

  setFavourites(): void {
    this.favoriteService.getAllFavorites()
      .then(favourites => this.favourites = favourites);
  }

  setSearchingTerm(searchingTerm): void {
    this.searchingTerm = searchingTerm;
  }

}

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
  private date = this.datePipe.transform(new Date(), 'yyyy-MM');
  private favouritesOnly = false;
  private searchingTerm = '';

  private categories = [];
  private locations = [];
  private favourites = [];

  constructor(private route: ActivatedRoute,
              private plt: Platform,
              private datePipe: DatePipe,
              private dataService: DataService,
              private favoriteService: FavouriteService) {}

  ngOnInit(): void {

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

    this.plt.ready()
      .then(() => {
        this.initFilters();
        this.setFilteredData();
        this.setFavourites();
    });
}

  favouritesFilter(): any {
    this.favouritesOnly = !this.favouritesOnly;
    this.setFilteredData();
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
        if (this.categories.indexOf(category) === -1) { this.categories.push(category); }
        if (this.locations.indexOf(location) === -1) { this.locations.push(location); }
      }
      this.categories.sort();
      this.locations.sort();
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

  getFilteredEvents(): any {
    return this.dataService.filterEvents(this.events, this.category, this.location, this.date, this.favouritesOnly, this.searchingTerm);
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
    this.date = formatDate(date, 'yyyy-MM', 'pl');
  }

  setFavourites(): void {
    this.favoriteService.getAllFavorites()
      .then(favourites => this.favourites = favourites);
  }

  setSearchingTerm(searchingTerm): void {
    this.searchingTerm = searchingTerm;
  }

}

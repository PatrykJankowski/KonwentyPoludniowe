import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NavController, Platform } from '@ionic/angular';
import { Events } from '../models/events.model';
import { DataService } from '../services/data.service';
import { FavoriteService } from '../services/favourites.service';

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

  private searchingTerm = '';
  private category = '';
  private location = '';
  private date = this.datePipe.transform(new Date(), 'yyyy-MM');

  private categories = [];
  private locations = [];
  private favourites = [];

  constructor(private route: ActivatedRoute, public dataService: DataService, public datePipe: DatePipe, private plt: Platform, private favoriteService: FavoriteService) {}

  ngOnInit(): void {

    this.plt.ready()
      .then(() => {
      this.loadData(true);
    });

    this.initFilters();
    this.setFilteredData();
    this.setFavourites();

    this.searchField = new FormControl();
    this.categoryFilter = new FormControl();
    this.locationFilter = new FormControl();
    this.dateFilter = new FormControl();

    this.searchField.valueChanges.subscribe(searchingTerm => {
      this.setSearchingTerm(searchingTerm);
      this.setFilteredEvents(this.dataService.searchEvents(this.events, this.searchingTerm));
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

  loadData(refresh = false, refresher?): void {
    this.dataService.getData(refresh)
      .subscribe(res => {
        this.events = res;
        if (refresher) {
          refresher.target.complete();
        }
      });
  }

  initFilters(): void {
    for (const event of this.events) {
      const category = event.event_type;
      const location = event.location;
      if (this.categories.indexOf(category) === -1) { this.categories.push(category); }
      if (this.locations.indexOf(location) === -1) { this.locations.push(location); }
    }
    this.categories.sort();
    this.locations.sort();
  }

  setFilteredData(): void {
    this.setEvents(this.route.snapshot.data.events);
    this.setEvents(this.dataService.filterEvents(this.events, this.category, this.location, this.date));
    this.setFilteredEvents(this.dataService.filterEvents(this.events, this.category, this.location, this.date));
    this.setSearchingTerm(this.searchingTerm);
    this.setFilteredEvents(this.dataService.searchEvents(this.filteredEvents, this.searchingTerm));
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

  setFilteredEvents(items): void {
    this.filteredEvents = items;
  }

  setEvents(events): void {
    this.events = events;
  }

  setSearchingTerm(searchingTerm): void {
    this.searchingTerm = searchingTerm;
  }

  setFavourites(): void {
    this.favoriteService.getAllFavorites()
      .then(favourites => { this.favourites = favourites; });
  }

  isFavourite(id) {

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

  addToFavourites(id) {
    if (!this.isFavourite(id)) {
      this.favoriteService.addToFavorites(id)
        .then(favourites => this.favourites = favourites);
    }
  }

  removeFromFavourites(id) {
    if (this.isFavourite(id)) {
      this.favoriteService.removeFromFavourites(id)
        .then(favourites => this.favourites = favourites);
    }
  }

}

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
        this.setFilteredEvents();
      });

    this.searchField = new FormControl();
    this.categoryFilter = new FormControl();
    this.locationFilter = new FormControl();
    this.dateFilter = new FormControl();

    this.searchField.valueChanges.subscribe(searchingTerm => {
      this.setSearchingTerm(searchingTerm);
      if (this.favouritesService.getFavouritesOnlyFlag()) {
        this.setFavourites();
      } else {
        this.setFilteredEvents();
      }
    });

    this.categoryFilter.valueChanges.subscribe(category => {
      this.setCategory(category);
      this.setFilteredEvents();
    });

    this.locationFilter.valueChanges.subscribe(location => {
      this.setLocation(location);
      this.setFilteredEvents();
    });

    this.dateFilter.valueChanges.subscribe(date => {
      this.setDate(date);
      this.dataService.getEvents(true, date)
        .subscribe(events => {
          console.log(events);
          this.events = events;
          this.setFilteredEvents();
        });
    });
  }

  ionViewWillEnter(): void {
    if (this.favouritesService.getFavouritesOnlyFlag()) {
      this.setFavourites();
    }
  }

  favouritesFilter(): any {
    this.favouritesService.setFavouritesOnlyFlag();
    if (this.favouritesService.getFavouritesOnlyFlag()) {
      this.setFavourites();
    } else {
      this.setFilteredEvents();
    }
  }

  initFilters(): void {
    if (this.events) {
      for (const event of this.events) {
        const category = event.event_type;
        const location = event.location;
        const year = formatDate(event.date_end, 'yyyy', 'pl');

        if (this.categories.indexOf(category) === -1) { this.categories.push(category); }
        if (this.locations.indexOf(location) === -1) { this.locations.push(location); }
        if (this.dates.indexOf(year) === -1) { this.dates.push(year); }
      }
      const maxDate = Math.max(...this.dates);
      for (let year = 2014; year < maxDate; year++) {
        this.dates.push(year);
      }

      this.categories.sort();
      this.locations.sort();
      this.dates.sort();
    }
  }

  addToFavourites(id): void {
    this.favouritesService.addToFavorites(id)
      .then(() => {
        if (this.favouritesService.getFavouritesOnlyFlag()) {
          this.setFavourites();
        }
      });
  }

  removeFromFavourites(id): void {
    this.favouritesService.removeFromFavourites(id)
      .then(() => {
        if (this.favouritesService.getFavouritesOnlyFlag()) {
          this.setFavourites();
        }
      });
  }

  setFilteredEvents(): void {
    this.filteredEvents = this.dataService.filterEvents(this.events, this.category, this.location, this.date, this.searchingTerm);
  }

  setFavourites(): void {
    this.filteredEvents = this.favouritesService.searchFav(this.favouritesService.getFavouritesEvents(this.events), this.searchingTerm);
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

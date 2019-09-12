import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Platform } from '@ionic/angular';

import { Event } from '@models/event.model';
import { DataService } from '@services/data.service';
import { FavouriteService } from '@services/favourites.service';

@Component({
  selector: 'ngx-home',
  templateUrl: 'events.page.html',
  styleUrls: ['events.page.scss']
})
export class EventsPage implements OnInit {
  public filteredEvents: Array<Event>;

  public searchField: FormControl;
  public categoryFilter: FormControl;
  public locationFilter: FormControl;
  public dateFilter: FormControl;

  public categories: Array<string> = [];
  public locations: Array<string> = [];
  public dates: Array<number> = [];

  private events: Array<Event> = this.route.snapshot.data.events;

  private category: string = '';
  private location: string = '';
  private date: string = '';
  private searchingTerm: string = '';

  constructor(private route: ActivatedRoute,
              private platform: Platform,
              private datePipe: DatePipe,
              private dataService: DataService,
              public favouritesService: FavouriteService) {}

  public ngOnInit(): void {
    this.platform.ready()
      .then(() => {
        this.initFilters();
        this.setFilteredEvents();
      });

    this.searchField = new FormControl();
    this.categoryFilter = new FormControl();
    this.locationFilter = new FormControl();
    this.dateFilter = new FormControl();

    this.searchField.valueChanges.subscribe((searchingTerm: string) => {
      this.setSearchingTerm(searchingTerm);
      if (this.favouritesService.getFavouritesOnlyFlag()) {
        this.setFavourites();
      } else {
        this.setFilteredEvents();
      }
    });

    this.categoryFilter.valueChanges.subscribe((category: string) => {
      this.setCategory(category);
      this.setFilteredEvents();
    });

    this.locationFilter.valueChanges.subscribe((location: string) => {
      this.setLocation(location);
      this.setFilteredEvents();
    });

    this.dateFilter.valueChanges.subscribe((date: string) => {
      this.setDate(date);
      this.dataService.getEvents(true, date)
        .subscribe((events: Array<Event>) => {
          this.events = events;
          this.setFilteredEvents();
        });
    });
  }

  public ionViewWillEnter(): void {
    if (this.favouritesService.getFavouritesOnlyFlag()) {
      this.setFavourites();
    }
  }

  private favouritesFilter(): any {
    this.favouritesService.setFavouritesOnlyFlag();
    if (this.favouritesService.getFavouritesOnlyFlag()) {
      this.setFavourites();
    } else {
      this.setFilteredEvents();
    }
  }

  private initFilters(): void {
    if (this.events) {
      for (const event of this.events) {
        const category: string = event.event_type;
        const location: string = event.location;
        const year: number = parseInt(formatDate(event.date_end, 'yyyy', 'pl'), 10);

        if (this.categories.indexOf(category) === -1) { this.categories.push(category); }
        if (this.locations.indexOf(location) === -1) { this.locations.push(location); }
        if (this.dates.indexOf(year) === -1) { this.dates.push(year); }
      }
      const maxDate: number = Math.max(...this.dates);
      for (let year: number = 2014; year < maxDate; year++) {
        this.dates.push(year);
      }

      this.categories.sort();
      this.locations.sort();
      this.dates.sort();
    }
  }

  private addToFavourites(id: number): void {
    this.favouritesService.addToFavorites(id)
      .then(() => {
        if (this.favouritesService.getFavouritesOnlyFlag()) {
          this.setFavourites();
        }
      });
  }

  private removeFromFavourites(id: number): void {
    this.favouritesService.removeFromFavourites(id)
      .then(() => {
        if (this.favouritesService.getFavouritesOnlyFlag()) {
          this.setFavourites();
        }
      });
  }

  private setFilteredEvents(): void {
    this.filteredEvents = this.dataService.filterEvents(this.events, this.category, this.location, this.date, this.searchingTerm);
  }

  private setFavourites(): void {
    this.filteredEvents = this.favouritesService.searchFav(this.favouritesService.getFavouritesEvents(this.events), this.searchingTerm);
  }

  private setCategory(category: string): void {
    this.category = category;
  }

  private setLocation(location: string): void {
    this.location = location;
  }

  private setDate(date: string): void {
    this.date = date;
  }

  private setSearchingTerm(searchingTerm: string): void {
    this.searchingTerm = searchingTerm;
  }
}

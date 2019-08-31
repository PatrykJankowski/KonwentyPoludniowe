import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Event } from '../models/event.model';

const STORAGE_KEY = 'favoriteEvents';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  private favouritesEvents: Array<number> = [];
  public favouritesEventsOnly: boolean = false;

  constructor(private storage: Storage) {
    this.getFavoritesEvents()
      .then(favourites => this.favouritesEvents = favourites);
  }

  public isFavourite(id: Number): Boolean {
    if (!this.favouritesEvents) {
      return false;
    }

    for (let i = 0; i < this.favouritesEvents.length; i++) {
      if (this.favouritesEvents[i] === id) {
        return true;
      }
    }

    return false;
  }

  public addToFavorites(eventId: number): Promise<any> {
    return this.getFavoritesEvents()
      .then(result => {
        let favourites: Array<number> = result;
        if (!favourites) {
          favourites = [];
        }
        favourites.push(eventId);
        this.setFavouritesEvents(favourites);

        return this.storage.set(STORAGE_KEY, favourites);
      });
  }

  public removeFromFavourites(eventId: number): Promise<any> {
    return this.getFavoritesEvents()
      .then(result => {
        const index = result.indexOf(eventId);
        result.splice(index, 1);
        this.setFavouritesEvents(result);

        return this.storage.set(STORAGE_KEY, result);
      });
  }

  public searchFav(events, search): Array<Event> {
    return events.filter((event: Event) => (
      (event.name.toLowerCase()
        .indexOf(search.toLowerCase()) > -1)));
  }

  public setFavouritesOnlyFlag(): void {
    this.favouritesEventsOnly = !this.favouritesEventsOnly;
  }

  private setFavouritesEvents(favouritesEvents): void {
    this.favouritesEvents = favouritesEvents;
  }

  public getFavouritesEvents(events: Array<Event>): Array<Event> {
    return events.filter((event: Event) => (
      this.isFavourite(event.id)
    ));
  }

  private getFavoritesEvents(): Promise<Array<number>> {
    return this.storage.get(STORAGE_KEY);
  }

  public getFavouritesOnlyFlag(): Boolean {
    return this.favouritesEventsOnly;
  }

}

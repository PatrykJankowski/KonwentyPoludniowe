import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from '../models/events.model';

const STORAGE_KEY = 'favoriteEvents';

@Injectable()
export class FavouriteService {
  favouritesEvents = [];
  favouritesEventsOnly = false;

  constructor(public storage: Storage) {
    this.getFavoritesEvents()
      .then(favourites => this.favouritesEvents = favourites);
  }

  isFavourite(id: Number): Boolean {
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

  addToFavorites(eventId: Number): Promise<any> {
    return this.getFavoritesEvents()
      .then(result => {
        let favourites: Array<Number> = result;
        if (!favourites) {
          favourites = [];
        }
        favourites.push(eventId);
        this.setFavouritesEvents(favourites);

        return this.storage.set(STORAGE_KEY, favourites);
      });
  }

  removeFromFavourites(eventId: Number): Promise<any> {
    return this.getFavoritesEvents()
      .then(result => {
        const index = result.indexOf(eventId);
        result.splice(index, 1);
        this.setFavouritesEvents(result);

        return this.storage.set(STORAGE_KEY, result);
      });
  }

  setFavouritesOnlyFlag(): void {
    this.favouritesEventsOnly = !this.favouritesEventsOnly;
  }

  setFavouritesEvents(favouritesEvents: Array<Number>): void {
    this.favouritesEvents = favouritesEvents;
  }

  getFavouritesEvents(events): Array<Events> {
    return events.filter((event: Events) => (
      this.isFavourite(event.id)
    ));
  }

  getFavoritesEvents(): Promise<Array<Number>> {
    return this.storage.get(STORAGE_KEY);
  }

  getFavouritesOnlyFlag(): Boolean {
    return this.favouritesEventsOnly;
  }

}

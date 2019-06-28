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

  addToFavorites(eventId: number): Promise<any> {
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

  removeFromFavourites(eventId: number): Promise<any> {
    return this.getFavoritesEvents()
      .then(result => {
        const index = result.indexOf(eventId);
        result.splice(index, 1);
        this.setFavouritesEvents(result);

        return this.storage.set(STORAGE_KEY, result);
      });
  }

  searchFav(events, search): Array<Events> {
    return events.filter((event: Events) => (
      (event.name.toLowerCase()
        .indexOf(search.toLowerCase()) > -1)));
  }

  setFavouritesOnlyFlag(): void {
    this.favouritesEventsOnly = !this.favouritesEventsOnly;
  }

  setFavouritesEvents(favouritesEvents): void {
    this.favouritesEvents = favouritesEvents;
  }

  getFavouritesEvents(events: Array<Events>): Array<Events> {
    return events.filter((event: Events) => (
      this.isFavourite(event.id)
    ));
  }

  getFavoritesEvents(): Promise<Array<number>> {
    return this.storage.get(STORAGE_KEY);
  }

  getFavouritesOnlyFlag(): Boolean {
    return this.favouritesEventsOnly;
  }

}

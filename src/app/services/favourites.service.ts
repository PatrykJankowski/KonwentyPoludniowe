import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'favoriteEvents';

@Injectable()
export class FavouriteService {
  favourites = [];

  constructor(public storage: Storage) {
    this.getAllFavorites()
      .then(favourites => this.favourites = favourites);
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

  addToFavorites(eventId): Promise<any> {
    return this.getAllFavorites()
      .then(result => {
        if (result) {
          result.push(eventId);

          this.favourites = result;

          return this.storage.set(STORAGE_KEY, result);
        }

        this.favourites = result;

        return this.storage.set(STORAGE_KEY, [eventId]);
      });
  }

  removeFromFavourites(eventId): Promise<any> {
    return this.getAllFavorites()
      .then(result => {
        if (result) {
          const index = result.indexOf(eventId);
          result.splice(index, 1);
          this.favourites = result;

          return this.storage.set(STORAGE_KEY, result);
        }
    });
  }

  getAllFavorites(): Promise<any> {
    return this.storage.get(STORAGE_KEY);
  }

}

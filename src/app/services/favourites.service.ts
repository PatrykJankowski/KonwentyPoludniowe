import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

const STORAGE_KEY = 'favoriteEvents';

@Injectable()
export class FavoriteService {

  constructor(public storage: Storage) {

    console.log(this.isFavorite(994));

  }

  isFavorite(eventId) {

    let isFav;

    from(this.getAllFavorites())
      .subscribe(result => {
        isFav = result && result.indexOf(eventId) !== -1;

        return isFav;
      });
  }

  addToFavorites(eventId): Promise<any> {
    return this.getAllFavorites()
      .then(result => {
        if (result) {
          result.push(eventId);

          return this.storage.set(STORAGE_KEY, result);
        }

        return this.storage.set(STORAGE_KEY, [eventId]);
      });
  }

  removeFromFavourites(eventId): Promise<any> {
    return this.getAllFavorites()
      .then(result => {
        if (result) {
          const index = result.indexOf(eventId);
          result.splice(index, 1);

          return this.storage.set(STORAGE_KEY, result);
        }
    });
  }

  getAllFavorites(): Promise<any> {
    return this.storage.get(STORAGE_KEY);
  }

}

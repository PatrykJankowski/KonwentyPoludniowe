import { TestBed } from '@angular/core/testing';

import { FavouriteService } from './favourites.service';

describe('FavouritesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavouriteService = TestBed.get(FavouriteService);
    expect(service)
      .toBeTruthy();
  });
});

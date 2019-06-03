import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { DataService } from '../services/data.service';

@Injectable()
export class EventDetailsResolverService implements Resolve<any> {
  constructor(private dataService: DataService) {}

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): any {
    return this.dataService.getDetails(activatedRouteSnapshot.params.id);
  }
}

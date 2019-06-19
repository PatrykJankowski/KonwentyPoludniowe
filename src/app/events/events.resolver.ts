import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class EventsResolver implements Resolve<any> {
  constructor(private dataService: DataService) {}

  resolve(): any {
    return this.dataService.getEvents();
  }
}

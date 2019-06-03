import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ResolverService implements Resolve<any> {
  constructor(private data: DataService) {}

    resolve(): any {
      return this.data.getData();
    }
}

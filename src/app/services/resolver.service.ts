import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ResolverService implements Resolve<any> {
  constructor(private data: DataService) {}

    resolve(): any {
      return this.data.getData();
  }
}

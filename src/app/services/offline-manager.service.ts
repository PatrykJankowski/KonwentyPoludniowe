import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { forkJoin, from, Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';

const STORAGE_REQ_KEY = 'KK-storedreq';

interface StoredRequest {
  url: string;
  type: string;
  data: any;
  time: number;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {

  constructor(private storage: Storage, private http: HttpClient, private toastController: ToastController) { }

  checkForEvents(): Observable<any> {
    return from(this.storage.get(STORAGE_REQ_KEY))
      .pipe(switchMap(storedOperations => {
        const storedObj = JSON.parse(storedOperations);
        if (storedObj && storedObj.length > 0) {
          return this.sendRequests(storedObj)
            .pipe(finalize(() => {
              const toastController = this.toastController.create({
                message: 'Dane lokalne zostały zsynchronizowane!',
                duration: 3000,
                position: 'bottom'
              });
              toastController.then(toast => toast.present());

              this.storage.remove(STORAGE_REQ_KEY);
            })
          );
        }

        return of(false);
      })
    );
  }

  sendRequests(operations: Array<StoredRequest>): Observable<any> {
    const obs = [];

    for (const op of operations) {
      const oneObs = this.http.request(op.type, op.url, op.data);
      obs.push(oneObs);
    }

    // Send out all local events and return once they are finished
    return forkJoin(obs);
  }
}

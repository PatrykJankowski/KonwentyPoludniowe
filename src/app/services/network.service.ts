import { Injectable } from '@angular/core';

import { Network } from '@ionic-native/network/ngx';
import { Platform, ToastController } from '@ionic/angular';

import { BehaviorSubject, Observable } from 'rxjs';

import { ConnectionStatus } from '../models/network';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

  constructor(private network: Network, private toastController: ToastController, private plt: Platform) {
    this.plt.ready()
      .then(() => {
      this.initializeNetworkEvents();
      const status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
    });
  }

  initializeNetworkEvents(): void {
    this.network.onDisconnect()
      .subscribe(() => {
        if (this.status.getValue() === ConnectionStatus.Online) {
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });

    this.network.onConnect()
      .subscribe(() => {
        if (this.status.getValue() === ConnectionStatus.Offline) {
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });
  }

  onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }

  private async updateNetworkStatus(status: ConnectionStatus): Promise<any> {
    this.status.next(status);

    const connection = status === ConnectionStatus.Offline ? 'Offline' : 'Online';
    const toastController = this.toastController.create({
      message: `Jesteś teraz ${connection}`,
      duration: 3000,
      position: 'bottom'
    });
    toastController.then(toast => toast.present());
  }
}

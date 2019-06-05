import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

  constructor(private network: Network, private toastController: ToastController, private plt: Platform) {
    this.plt.ready()
      .then(() => {
      this.initializeNetworkEvents();
      const status =  this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
    });
  }

  initializeNetworkEvents() {
    this.network.onDisconnect()
      .subscribe(() => {     console.log("------------------------ asdasd DDDDDDDD ----------------------")

        if (this.status.getValue() === ConnectionStatus.Online) {
        console.log('WE ARE OFFLINE');
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });

    this.network.onConnect()
      .subscribe(() => {     console.log("------------------------ asdasd DDDDDDDD ----------------------")

        if (this.status.getValue() === ConnectionStatus.Offline) {
        console.log('WE ARE ONLINE');
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
    const toast = this.toastController.create({
      message: `You are now ${connection}`,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }
}

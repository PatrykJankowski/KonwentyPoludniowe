import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { UserAgent } from '@ionic-native/user-agent';

if (environment.production) {
  enableProdMode();
}

UserAgent.set('SouthEvents')
  .then(() => console.log('iiiii'))
  .catch((error: any) => console.log('dd' + error));

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.log(err));

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools'; // 👈 Import this

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { appReducers } from './core/state/app.state';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes), provideStore(appReducers),
    provideStoreDevtools({
      maxAge: 30,
    })
  ],
};

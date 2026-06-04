import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools'; // 👈 Import this

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { appReducers } from './core/state/app.state';
import { storageMetaReducer } from './core/state/storage.meta-reducer';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes), provideStore(appReducers,
    {metaReducers: [storageMetaReducer]}
  ),
    provideStoreDevtools({
      maxAge: 30,
    })
  ],
};

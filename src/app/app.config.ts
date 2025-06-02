import { ApplicationConfig } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: 'APP_INITIALIZER',
      useFactory: (router: Router) => {
        return () => {
          router.events.subscribe(() => {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('lastUrl', window.location.pathname);
            }
          });
        };
      },
      deps: [Router],
      multi: true,
    },
  ],
};

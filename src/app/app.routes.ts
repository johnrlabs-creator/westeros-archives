import { Routes } from '@angular/router';
import { authGuard } from './core/utils/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login-page/login-page').then((m) => m.LoginPage),
    title: 'Login',
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      // Home
      {
        path: 'home',
        loadComponent: () =>
          import('./features/landing-page/landing-page').then((m) => m.LandingPage),
        title: 'Home',
      },
      // List Pages
      {
        path: 'houses',
        loadComponent: () => import('./features/list/list').then((m) => m.List),
        title: 'Houses',
      },
      {
        path: 'houses/:id',
        loadComponent: () => import('./features/details/details').then((m) => m.Details),
        title: 'House Details',
      },
      {
        path: 'books',
        loadComponent: () => import('./features/list/list').then((m) => m.List),
        title: 'Books',
      },
      {
        path: 'books/:id',
        loadComponent: () => import('./features/details/details').then((m) => m.Details),
        title: 'Book Details',
      },
      {
        path: 'characters',
        loadComponent: () => import('./features/list/list').then((m) => m.List),
        title: 'Characters',
      },
      {
        path: 'characters/:id',
        loadComponent: () => import('./features/details/details').then((m) => m.Details),
        title: 'Character Details',
      },
      {
        path: 'favorites',
        loadComponent: () => import('./features/favorites/favorites').then((m) => m.Favorites),
        title: 'Favorites',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];

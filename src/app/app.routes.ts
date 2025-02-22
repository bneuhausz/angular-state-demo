import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'native-features',
    loadComponent: () => import('./native-features/native-features.component')
  },
  {
    path: 'native-with-redux-devtools',
    loadComponent: () => import('./native-with-redux-devtools/native-with-redux-devtools.component')
  },
  {
    path: 'ngrx-signal-store',
    loadComponent: () => import('./ngrx-signal-store/ngrx-signal-store.component')
  }
];

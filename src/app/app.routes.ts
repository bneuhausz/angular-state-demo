import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'native-features',
    loadComponent: () => import('./native-features/native-features.component')
  },
  {
    path: 'ngrx-signal-store',
    loadComponent: () => import('./ngrx-signal-store/ngrx-signal-store.component')
  }
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'native-features',
    loadComponent: () => import('./native-features/native-features.component')
  }
];

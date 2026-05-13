import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'kundali-milan/bhavishya',
    redirectTo: 'bhavishya',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/kundali-milan/kundali-milan.component')
        .then(m => m.KundaliMilanComponent)
  },
  {
    path: 'bhavishya',
    loadComponent: () =>
      import('./components/bhavishya/bhavishya.component')
        .then(m => m.BhavishyaComponent)
  },
  { path: '**', redirectTo: '' }
];

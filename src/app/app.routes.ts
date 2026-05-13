import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'kundali-milan',
    redirectTo: '',
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

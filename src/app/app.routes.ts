import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'kundali-milan',
    pathMatch: 'full'
  },
  {
    path: 'kundali-milan',
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
  { path: '**', redirectTo: 'kundali-milan' }
];

import { Routes } from '@angular/router';
import { KundaliMilanComponent } from './components/kundali-milan/kundali-milan.component';

export const routes: Routes = [
  {
    path: '', component: KundaliMilanComponent
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

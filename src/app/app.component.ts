import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavComponent],
  template: `
    <app-header />
    <app-nav />
    <div class="main">
      <router-outlet />
    </div>
    <div class="disc">
      Kundali Milan is computed using the traditional Vedic Ashta Koota Gun Milan system.<br>
      Moon longitude via Jean Meeus <em>Astronomical Algorithms</em> Ch.47 · Lahiri Ayanamsha correction applied.<br>
      Consult a qualified Jyotishi for complete chart analysis and life decisions.
    </div>
  `
})
export class AppComponent {}

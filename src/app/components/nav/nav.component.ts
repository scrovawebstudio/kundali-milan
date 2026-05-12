import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="app-nav">
      <a class="nav-tab" routerLink="/kundali-milan" routerLinkActive="active">
        <span class="tab-icon"></span><span>Kundali Milan</span>
      </a>
      <a class="nav-tab" routerLink="/bhavishya" routerLinkActive="active">
        <span class="tab-icon"></span><span>Bhavishya</span>
      </a>
    </nav>
  `
})
export class NavComponent {}

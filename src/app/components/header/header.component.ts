import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService, Lang } from '../../services/lang.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(public langSvc: LangService) {}

  switch(lang: Lang) { this.langSvc.switch(lang); }
}

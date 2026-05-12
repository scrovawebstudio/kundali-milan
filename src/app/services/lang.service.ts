import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'en' | 'hi' | 'mr';

@Injectable({ providedIn: 'root' })
export class LangService {
  private _lang = new BehaviorSubject<Lang>(this.getSaved());
  lang$ = this._lang.asObservable();

  get current(): Lang { return this._lang.value; }

  switch(lang: Lang) {
    if (lang === this._lang.value) return;
    this._lang.next(lang);
    try { localStorage.setItem('kundali_lang', lang); } catch {}
    // Trigger Google Translate if needed
    if (lang !== 'en') {
      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (combo) { combo.value = lang; combo.dispatchEvent(new Event('change')); }
    } else {
      try {
        const gt = (window as any).google?.translate?.TranslateElement?.getInstance();
        if (gt?.restore) gt.restore();
      } catch {}
    }
  }

  private getSaved(): Lang {
    try { return (localStorage.getItem('kundali_lang') as Lang) || 'en'; } catch { return 'en'; }
  }
}

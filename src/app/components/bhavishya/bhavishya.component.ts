import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AstrologyService } from '../../services/astrology.service';
import { BhavishyaResult, LifeArea, GuidanceItem } from '../../models/models';
import { TimePickerComponent } from '../shared/time-picker.component';
import { TzSelectComponent } from '../shared/tz-select.component';
import { SafeHtmlPipe } from '../shared/safe-html.pipe';

@Component({
  selector: 'app-bhavishya',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TimePickerComponent, TzSelectComponent, SafeHtmlPipe],
  templateUrl: './bhavishya.component.html'
})
export class BhavishyaComponent {
  loading  = signal(false);
  result   = signal<BhavishyaResult | null>(null);
  error    = signal('');
  activeTab = signal<'life'|'dasha'|'bhava'|'dosha'|'guidance'|'recs'>('life');

  form = this.fb.group({
    name:   ['', Validators.required],
    gender: ['male'],
    dob:    ['', Validators.required],
    tob:    ['12:00', Validators.required],
    tz:     ['5.5',   Validators.required],
    city:   ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private svc: AstrologyService) {}

  submit() {
    if (this.form.invalid) { this.error.set('Please fill in all required fields.'); return; }
    this.error.set('');
    this.loading.set(true);
    this.result.set(null);

    this.svc.calculateBhavishya(this.form.value as any).subscribe({
      next: data => {
        this.result.set(data);
        this.loading.set(false);
        setTimeout(() => document.getElementById('bhav-results')?.scrollIntoView({ behavior: 'smooth' }), 80);
      },
      error: err => {
        this.error.set(err.error?.error || 'Calculation failed. Please try again.');
        this.loading.set(false);
      }
    });
  }

  reset() { this.result.set(null); this.error.set(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  setTab(t: 'life'|'dasha'|'bhava'|'dosha'|'guidance'|'recs') { this.activeTab.set(t); }

  strClass(s: string) { return s === 'strong' ? 'lcs' : s === 'caution' ? 'lcc' : 'lcw'; }
  strLabel(s: string) { return s === 'strong' ? '✦ Strong Period' : s === 'caution' ? '◆ Caution Advised' : '⚠ Challenging Phase'; }

  pct(d: import('../../models/models').BhavaDasha | null): number {
    if (!d) return 0;
    const s = new Date(d.mahaStart + '-01'), e = new Date(d.mahaEnd + '-01'), n = new Date();
    return Math.min(99, Math.max(1, (n.getTime() - s.getTime()) / (e.getTime() - s.getTime()) * 100));
  }

  PLANET_SYM: Record<string, string> = {
    Surya:'☉', Chandra:'☽', Mangal:'♂', Budha:'☿',
    Guru:'♃',  Shukra:'♀',  Shani:'♄',  Rahu:'☊', Ketu:'☋'
  };

  sym(pl: string) { return this.PLANET_SYM[pl] || '★'; }

  remKeys: Array<{ key: keyof BhavishyaResult['remedies']; icon: string; title: string }> = [
    { key:'mantras',    icon:'🕉️', title:'Mantras & Chanting' },
    { key:'donations',  icon:'🪷', title:'Donations & Charity' },
    { key:'temples',    icon:'🏛️', title:'Temples & Pilgrimage' },
    { key:'spiritual',  icon:'🧘', title:'Spiritual Practices' },
    { key:'behavioral', icon:'✨', title:'Behavioral Remedies' }
  ];

  // Build North-Indian bhava chart SVG inline
  bhavaSvg(r: BhavishyaResult): string {
    const cells = r.bhavaData.bhavaCells;
    const lagna = r.bhavaData.lagnaRashi;
    const name  = r.bhavaData.personName;

    // 4×4 grid positions; nulls are centre cells (indices 5,6,9,10)
    // BHAVA_ORDER = [12,1,2,3,11,_,_,4,10,_,_,5,9,8,7,6]
    const W = 280, H = 280, cw = W/4, ch = H/4;
    const pos = [
      [0,0],[1,0],[2,0],[3,0],
      [0,1],            [3,1],
      [0,2],            [3,2],
      [0,3],[1,3],[2,3],[3,3]
    ];
    const houseOrder = [12,1,2,3,11,4,10,5,9,8,7,6];

    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:300px;display:block;margin:0 auto">`;
    s += `<rect width="${W}" height="${H}" rx="4" fill="rgba(10,5,2,0.6)" stroke="rgba(212,160,23,0.3)" stroke-width="1"/>`;

    // Centre cell
    s += `<rect x="${cw}" y="${ch}" width="${cw*2}" height="${ch*2}" fill="rgba(212,160,23,0.04)" stroke="rgba(212,160,23,0.18)" stroke-width="0.5"/>`;
    const cx = cw + cw, cy = ch + ch;
    s += `<text x="${cx}" y="${cy-14}" text-anchor="middle" font-size="18" fill="rgba(212,160,23,0.7)">ॐ</text>`;
    s += `<text x="${cx}" y="${cy+4}" text-anchor="middle" font-size="8" fill="rgba(212,160,23,0.55)" font-family="Crimson Pro,serif">${name}</text>`;
    s += `<text x="${cx}" y="${cy+17}" text-anchor="middle" font-size="7" fill="rgba(212,160,23,0.4)">Lagna: ${lagna}</text>`;

    pos.forEach(([col, row], idx) => {
      const house = houseOrder[idx];
      const cell  = cells.find(c => c && c.house === house);
      const x = col * cw, y = row * ch;
      const px = x + cw / 2, py = y + ch / 2;

      s += `<rect x="${x+0.5}" y="${y+0.5}" width="${cw-1}" height="${ch-1}" fill="rgba(255,245,220,0.02)" stroke="rgba(212,160,23,0.22)" stroke-width="0.5"/>`;
      s += `<text x="${x+4}" y="${y+11}" font-size="7" fill="rgba(212,160,23,0.45)">H${house}</text>`;
      if (cell) {
        s += `<text x="${px}" y="${py-5}" text-anchor="middle" font-size="7.5" fill="rgba(212,160,23,0.6)">${cell.rashi}</text>`;
        if (cell.planets.length) {
          s += `<text x="${px}" y="${py+9}" text-anchor="middle" font-size="9" fill="#E8621A">${cell.planets.join(' ')}</text>`;
        }
      }
    });

    s += `</svg>`;
    return s;
  }

  // Zodiac strip SVG
  zodiacSvg(r: BhavishyaResult): string {
    const W = 660, H = 60;
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">`;
    const signs = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
    const snames = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrischika','Dhanu','Makara','Kumbha','Meena'];
    const sw = W / 12;
    signs.forEach((sym, i) => {
      const x = i * sw;
      const fill = i % 2 === 0 ? 'rgba(212,160,23,0.04)' : 'rgba(0,0,0,0.12)';
      s += `<rect x="${x}" y="0" width="${sw}" height="${H}" fill="${fill}" stroke="rgba(212,160,23,0.15)" stroke-width="0.5"/>`;
      s += `<text x="${x + sw/2}" y="18" text-anchor="middle" font-size="14" fill="rgba(212,160,23,0.5)">${sym}</text>`;
      s += `<text x="${x + sw/2}" y="30" text-anchor="middle" font-size="6" fill="rgba(212,160,23,0.35)">${snames[i]}</text>`;
    });
    // Planet dots
    const PSYM: Record<string,string> = { sun:'☉', moon:'☽', mars:'♂', mer:'☿', jup:'♃', ven:'♀', sat:'♄', rahu:'☊', ketu:'☋' };
    const PCOL: Record<string,string> = { sun:'#FFD700', moon:'#E8D5FF', mars:'#FF6B6B', mer:'#90EE90', jup:'#FFD700', ven:'#FFB6C1', sat:'#B0C4DE', rahu:'#9370DB', ketu:'#DEB887' };
    const placed: number[] = [];
    r.zodiacStrip.forEach((p, pi) => {
      const rashiIdx = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrischika','Dhanu','Makara','Kumbha','Meena'].indexOf(p.rashi);
      if (rashiIdx < 0) return;
      const deg = ((p.lon % 30) + 30) % 30;
      const xp  = rashiIdx * sw + (deg / 30) * sw;
      const stack = placed.filter(x2 => Math.abs(x2 - xp) < 10).length;
      const yp  = 44 + stack * 9;
      placed.push(xp);
      s += `<text x="${xp}" y="${yp}" text-anchor="middle" font-size="9" fill="${PCOL[p.key] || '#D4A017'}" title="${p.name}">${PSYM[p.key] || '●'}</text>`;
    });
    s += `</svg>`;
    return s;
  }

  today = new Date().toISOString().slice(0, 7);
  window = window;

  shareWA(r: BhavishyaResult) {
    const cur = r.dashaProgress;
    const msg = `🔮 *Bhavishya — Vedic Astrology Report*\n*${r.name}*\n\n🌙 Moon Sign: ${r.moonRashiShort}\n⭐ Nakshatra: ${r.nakshatra}\n\n*Current Dasha: ${cur?.mahaLabel || r.maha} Mahadasha*\n${cur ? `${cur.mahaStart} → ${cur.mahaEnd} (${cur.mahaYrs} yrs)` : ''}\n\n_Computed using Vedic Ashta Koota & Vimshottari Dasha · Jean Meeus Algorithm_`;
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
  }
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AstrologyService } from '../../services/astrology.service';
import { KundaliMilanResult } from '../../models/models';
import { TimePickerComponent } from '../shared/time-picker.component';
import { TzSelectComponent } from '../shared/tz-select.component';
import { SafeHtmlPipe } from '../shared/safe-html.pipe';
import { MedicalReportComponent } from '../shared/medical-report.component';

const BG_OPTS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

@Component({
  selector: 'app-kundali-milan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TimePickerComponent, TzSelectComponent, SafeHtmlPipe, MedicalReportComponent],
  templateUrl: './kundali-milan.component.html'
})
export class KundaliMilanComponent {
  bgOptions = BG_OPTS;
  loading   = signal(false);
  result    = signal<KundaliMilanResult | null>(null);
  error     = signal('');

  form = this.fb.group({
    boyName:  ['', Validators.required],
    boyDOB:   ['', Validators.required],
    boyTOB:   ['12:00', Validators.required],
    boyTZ:    ['5.5', Validators.required],
    boyCity:  ['', Validators.required],
    boyBG:    [''],
    girlName: ['', Validators.required],
    girlDOB:  ['', Validators.required],
    girlTOB:  ['12:00', Validators.required],
    girlTZ:   ['5.5', Validators.required],
    girlCity: ['', Validators.required],
    girlBG:   ['']
  });

  constructor(private fb: FormBuilder, private svc: AstrologyService) {}

  submit() {
    if (this.form.invalid) { this.error.set('Please fill in all required fields.'); return; }
    this.error.set('');
    this.loading.set(true);
    this.result.set(null);

    this.svc.calculateKundaliMilan(this.form.value as any).subscribe({
      next: data => { this.result.set(data); this.loading.set(false); setTimeout(() => document.getElementById('km-results')?.scrollIntoView({ behavior: 'smooth' }), 80); },
      error: err => { this.error.set(err.error?.error || 'Calculation failed. Please try again.'); this.loading.set(false); }
    });
  }

  reset() { this.result.set(null); this.error.set(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  verdictLabel(v: string) {
    const m: Record<string,string> = { Excellent:'🌟 Excellent Match', Good:'✨ Good Match', Average:'⚡ Average Match', Low:'⚠ Low Compatibility' };
    return m[v] || v;
  }

  scorePercent(total: number) { return ((total / 36) * 100).toFixed(0); }
  scoreColor(total: number) {
    if (total >= 33) return '#2D7A4F';
    if (total >= 25) return '#5A8A3A';
    if (total >= 18) return '#D4A017';
    return '#8B1A1A';
  }
  pillClass(score: number, max: number) { const f = score / max; return f === 1 ? 'pf' : f === 0 ? 'pz' : 'pp'; }
  fracPct(score: number, max: number) { return (score / max * 100).toFixed(0); }
  formatScore(s: number) { return Number.isInteger(s) ? s : s.toFixed(1); }

  // Radar chart SVG points
  radarSvg(kootas: Record<string, number>): string {
    const labels = ['Varna','Vashya','Tara','Yoni','Gr.Maitri','Gana','Bhakoot','Nadi'];
    const maxV   = [1,2,3,4,5,6,7,8];
    const keys   = ['varna','vashya','tara','yoni','grahaMaitri','gana','bhakoot','nadi'];
    const sc     = keys.map(k => kootas[k] ?? 0);
    const n = 8, cx = 160, cy = 148, R = 100;
    const pt = (i: number, v: number, mx: number, rad: number) => {
      const a = (Math.PI * 2 * i / n) - Math.PI / 2;
      const d = (v / mx) * rad;
      return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
    };
    let s = '';
    for (let ring = 1; ring <= 4; ring++) {
      const pts = Array.from({length:n}, (_,i) => pt(i,ring,4,R).join(',')).join(' ');
      s += `<polygon points="${pts}" fill="none" stroke="rgba(212,160,23,0.12)" stroke-width="1"/>`;
    }
    for (let i = 0; i < n; i++) { const [x,y] = pt(i,1,1,R); s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(212,160,23,0.14)" stroke-width="1"/>`; }
    const dp = sc.map((v,i) => pt(i,v,maxV[i],R).join(',')).join(' ');
    s += `<polygon points="${dp}" fill="rgba(232,98,26,0.22)" stroke="#E8621A" stroke-width="2"/>`;
    sc.forEach((v,i) => { const [x,y] = pt(i,v,maxV[i],R); s += `<circle cx="${x}" cy="${y}" r="4" fill="#E8621A" stroke="#FAF3E0" stroke-width="1.5"/>`; });
    labels.forEach((lb,i) => { const [x,y] = pt(i,1,1,R+20); const a = x < cx-4 ? 'end' : x > cx+4 ? 'start' : 'middle'; s += `<text x="${x}" y="${y+4}" text-anchor="${a}" font-size="10" fill="#7A5C30" font-family="Crimson Pro,serif">${lb}</text>`; });
    return s;
  }

  today() { return new Date().toISOString().slice(0, 7); }
  window = window;

  shareWA(r: KundaliMilanResult) {
    const rows = r.kootaRows.map(k => `  • ${k.name}: ${this.formatScore(k.score)}/${k.max}`).join('\n');
    const msg  = `🙏 *Kundali Milan Result*\n${r.boyName} ♡ ${r.girlName}\n*Score: ${this.formatScore(r.total)}/36 — ${this.verdictLabel(r.verdict)}*\n\n*Ashta Koota:*\n${rows}\n\n_Vedic Ashta Koota Gun Milan · Jean Meeus Moon Algorithm · Lahiri Ayanamsha_`;
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
  }
}

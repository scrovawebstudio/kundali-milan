import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AstrologyService } from '../../services/astrology.service';
import { MedicalResult } from '../../models/models';

@Component({
  selector: 'app-medical-report',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading()">Loading medical analysis…</div>
    <div *ngIf="result() as med">
      <!-- Risk Badge -->
      <div style="margin-bottom:1rem">
        <span class="compat-badge" [class.cb-warn]="med.analysis.overallRisk==='high'" [class.cb-caution]="med.analysis.overallRisk==='moderate'" [class.cb-safe]="med.analysis.overallRisk==='low'">
          {{ riskIcon(med.analysis.overallRisk) }} {{ riskLabel(med.analysis.overallRisk) }}
        </span>
      </div>

      <!-- Conditions -->
      <div class="med-conditions">
        <div class="med-cond-card" *ngFor="let c of med.analysis.conditions" [class]="c.cardCls">
          <!-- Rh warning box -->
          <div class="rh-warning" *ngIf="c.rhWarning">
            <p>🚨 Critical: Rh Incompatibility Detected — Father Rh+ × Mother Rh−</p>
            <p>This combination is medically significant. The bride MUST receive Anti-D (Rh immunoglobulin) injection after every pregnancy event. Without this, subsequent pregnancies can develop life-threatening fetal anemia (Hemolytic Disease of the Newborn). With proper management, outcomes are excellent.</p>
            <p>👩‍⚕️ Register this information with your OB-GYN immediately at the start of every pregnancy.</p>
          </div>
          <div class="mc-head">
            <span class="mc-icon">{{ c.icon }}</span>
            <span class="mc-title">{{ c.title }}</span>
            <span class="mc-badge" [class]="c.badgeCls">{{ c.badge }}</span>
          </div>
          <p class="mc-text">{{ c.text }}</p>
          <p class="mc-text" *ngIf="c.action" style="margin-top:.5rem;padding-top:.5rem;border-top:1px solid rgba(212,160,23,.1)"><strong>Action:</strong> {{ c.action }}</p>
        </div>
      </div>

      <!-- Blood Tests -->
      <div style="margin:1.4rem 0 .5rem"><strong style="font-size:.8rem;color:var(--gold-light)">Recommended Pre-Marriage Blood Tests</strong></div>
      <div *ngFor="let group of testGroups">
        <ng-container *ngIf="testsOfPriority(med.tests, group.key) as grouped">
          <div *ngIf="grouped.length" style="margin:.8rem 0 .4rem;font-size:.82rem;color:var(--text-light)">
            <strong [style.color]="group.color">{{ group.label }}</strong> — {{ group.desc }}
          </div>
          <div class="tests-grid" *ngIf="grouped.length">
            <div class="test-card" *ngFor="let t of grouped">
              <span class="test-priority" [class]="'tp-'+t.priority">{{ t.priorityLabel }} · {{ t.who }}</span>
              <div class="test-name">{{ t.name }}</div>
              <div class="test-why">{{ t.why }}</div>
              <div class="test-note">💡 {{ t.note }}</div>
            </div>
          </div>
        </ng-container>
      </div>

      <div class="med-disclaimer">⚕️ <strong>Medical Disclaimer:</strong> This analysis is for educational awareness only and is based on established medical knowledge about blood group compatibility and hereditary conditions. It is NOT a substitute for professional medical advice. All couples are strongly advised to consult a qualified physician, gynecologist, or genetic counselor for personalized pre-marital health screening.</div>
    </div>
  `
})
export class MedicalReportComponent implements OnInit {
  @Input() boyBG!: string;
  @Input() girlBG!: string;

  loading = signal(true);
  result  = signal<MedicalResult | null>(null);

  testGroups = [
    { key:'essential',   color:'#FF9898', label:'Essential — Do Before Marriage',       desc:'These tests are non-negotiable. Results directly affect pregnancy safety and child health planning.' },
    { key:'important',   color:'var(--gold-light)', label:'Important — Strongly Advised', desc:'High-yield tests that catch common serious conditions early, when treatment is most effective.' },
    { key:'recommended', color:'#7EE0AA', label:'Recommended — For Complete Picture',    desc:'Additional screening for comprehensive family health planning and early detection.' }
  ];

  constructor(private svc: AstrologyService) {}

  ngOnInit() {
    this.svc.analyzeMedical(this.boyBG, this.girlBG).subscribe({
      next: d => { this.result.set(d); this.loading.set(false); },
      error: ()=> this.loading.set(false)
    });
  }

  riskIcon(risk: string) { return risk==='high'?'⚠️':risk==='moderate'?'◆':'✓'; }
  riskLabel(risk: string) {
    const m: Record<string,string> = { high:'Important Medical Precautions Required', moderate:'Some Monitoring Recommended', low:'Generally Compatible — Routine Screening Advised' };
    return m[risk] || risk;
  }
  testsOfPriority(tests: any[], priority: string) { return tests.filter(t => t.priority === priority); }
}

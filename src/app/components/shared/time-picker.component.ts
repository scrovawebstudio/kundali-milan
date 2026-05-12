import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [FormsModule, NgFor],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimePickerComponent), multi: true }],
  template: `
    <div class="time-row">
      <select [(ngModel)]="hh" (ngModelChange)="emit()">
        <option *ngFor="let h of hours" [value]="h">{{ h }}</option>
      </select>
      <span class="time-sep">:</span>
      <select [(ngModel)]="mm" (ngModelChange)="emit()">
        <option *ngFor="let m of minutes" [value]="m">{{ m }}</option>
      </select>
      <select [(ngModel)]="ap" (ngModelChange)="emit()">
        <option>AM</option>
        <option>PM</option>
      </select>
    </div>
  `
})
export class TimePickerComponent implements ControlValueAccessor {
  hours   = Array.from({length:12}, (_,i) => i + 1);
  minutes = Array.from({length:60}, (_,i) => String(i).padStart(2,'0'));

  hh: number = 12;
  mm: string = '00';
  ap: string = 'AM';

  private onChange = (_: string) => {};
  private onTouched = () => {};

  emit() {
    let h = this.hh;
    if (this.ap === 'AM' && h === 12) h = 0;
    else if (this.ap === 'PM' && h !== 12) h += 12;
    this.onChange(String(h).padStart(2,'0') + ':' + this.mm);
  }

  writeValue(val: string) {
    if (!val) return;
    const [hStr, mStr] = val.split(':');
    let h = parseInt(hStr, 10);
    this.mm = mStr;
    this.ap = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    this.hh = h;
  }

  registerOnChange(fn: (_: string) => void) { this.onChange = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }
}
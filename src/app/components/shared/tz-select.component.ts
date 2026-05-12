import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tz-select',
  standalone: true,
  imports: [FormsModule],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TzSelectComponent), multi: true }],
  template: `
    <select [(ngModel)]="value" (ngModelChange)="onChange($event)">
      <optgroup label="South Asia">
        <option value="5.5">India (IST +5:30)</option>
        <option value="5.75">Nepal (NPT +5:45)</option>
        <option value="6">Bangladesh (BST +6)</option>
        <option value="5">Pakistan (PKT +5)</option>
      </optgroup>
      <optgroup label="Middle East">
        <option value="4">UAE (GST +4)</option>
        <option value="3">Saudi Arabia (+3)</option>
      </optgroup>
      <optgroup label="Europe">
        <option value="0">UK (GMT 0)</option>
        <option value="1">Europe Central (CET +1)</option>
        <option value="2">Europe Eastern (EET +2)</option>
      </optgroup>
      <optgroup label="Americas">
        <option value="-5">USA Eastern (EST -5)</option>
        <option value="-6">USA Central (CST -6)</option>
        <option value="-7">USA Mountain (MST -7)</option>
        <option value="-8">USA Pacific (PST -8)</option>
      </optgroup>
      <optgroup label="Oceania">
        <option value="10">Australia Eastern (AEST +10)</option>
        <option value="8">Australia Western (AWST +8)</option>
      </optgroup>
    </select>
  `
})
export class TzSelectComponent implements ControlValueAccessor {
  value: string = '5.5';
  onChange = (_: string) => {};
  onTouched = () => {};
  writeValue(v: string) { this.value = v ?? '5.5'; }
  registerOnChange(fn: (_: string) => void) { this.onChange = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  ApiResponse, KundaliMilanInput, KundaliMilanResult,
  BhavishyaInput, BhavishyaResult, MedicalResult
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class AstrologyService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  calculateKundaliMilan(input: KundaliMilanInput): Observable<KundaliMilanResult> {
    return this.http.post<ApiResponse<KundaliMilanResult>>(`${this.base}/kundali-milan`, input)
      .pipe(map(r => r.data));
  }

  calculateBhavishya(input: BhavishyaInput): Observable<BhavishyaResult> {
    return this.http.post<ApiResponse<BhavishyaResult>>(`${this.base}/bhavishya`, input)
      .pipe(map(r => r.data));
  }

  analyzeMedical(boyBG: string, girlBG: string): Observable<MedicalResult> {
    return this.http.post<ApiResponse<MedicalResult>>(`${this.base}/medical`, { boyBG, girlBG })
      .pipe(map(r => r.data));
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentRequestDto, PaymentRecord } from '../models/payment.models';

@Injectable({
  providedIn: 'root'
})
export class PaymentIntegrationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  processPayment(request: PaymentRequestDto): Observable<PaymentRecord> {
    return this.http.post<PaymentRecord>(this.apiUrl, request);
  }

  getStudentPayments(): Observable<PaymentRecord[]> {
    return this.http.get<PaymentRecord[]>(`${this.apiUrl}/student`);
  }

  getTeacherPayments(): Observable<PaymentRecord[]> {
    return this.http.get<PaymentRecord[]>(`${this.apiUrl}/teacher`);
  }

  getAdminPayments(): Observable<PaymentRecord[]> {
    return this.http.get<PaymentRecord[]>(`${this.apiUrl}/admin`);
  }
}

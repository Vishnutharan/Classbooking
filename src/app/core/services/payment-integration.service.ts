import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
  bookingId: string;
}

export interface PaymentReceipt {
  id: string;
  amount: number;
  status: 'Success' | 'Failed' | 'Pending';
  date: Date;
  method: 'Card' | 'PayPal' | 'BankTransfer';
}

@Injectable({
  providedIn: 'root'
})
export class PaymentIntegrationService {
  private http = inject(HttpClient);
  private apiUrl = 'api/payments';

  // Mock payment processing
  processPayment(bookingId: string, amount: number, method: string): Observable<PaymentReceipt> {
    console.log(`Processing payment of LKR ${amount} for booking ${bookingId} via ${method}`);
    
    // Simulate API call
    const receipt: PaymentReceipt = {
      id: `PAY-${Date.now()}`,
      amount: amount,
      status: 'Success',
      date: new Date(),
      method: method as any
    };

    return of(receipt).pipe(delay(2000));
  }

  createPaymentIntent(bookingId: string): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(`${this.apiUrl}/create-intent`, { bookingId });
  }

  refundPayment(paymentId: string, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/refund`, { paymentId, reason });
  }

  getPaymentHistory(userId: string): Observable<PaymentReceipt[]> {
    // Mock history
    return of([
      { id: 'PAY-001', amount: 1500, status: 'Success', date: new Date('2023-10-01'), method: 'Card' },
      { id: 'PAY-002', amount: 2000, status: 'Success', date: new Date('2023-10-05'), method: 'PayPal' }
    ] as PaymentReceipt[]).pipe(delay(1000));
  }

  generateInvoice(bookingId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/invoice/${bookingId}`, { responseType: 'blob' });
  }
}
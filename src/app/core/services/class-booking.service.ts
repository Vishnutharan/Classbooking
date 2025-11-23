import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassBooking } from '../models/shared.models';
import { environment } from '../../../environments/environment';

export interface BookingRequest {
  teacherId: string;
  subject: string;
  date: Date;
  startTime: string;
  endTime: string;
  classType: 'OneTime' | 'Recurring';
  recurringDays?: string[];
  notes?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking?: ClassBooking;
}

@Injectable({
  providedIn: 'root'
})
export class ClassBookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bookings`;

  getStudentBookings(): Observable<ClassBooking[]> {
    return this.http.get<ClassBooking[]>(this.apiUrl);
  }

  getTeacherBookings(): Observable<ClassBooking[]> {
    return this.http.get<ClassBooking[]>(this.apiUrl);
  }

  getAllBookings(): Observable<ClassBooking[]> {
    return this.http.get<ClassBooking[]>(this.apiUrl);
  }

  getBookingById(id: string): Observable<ClassBooking> {
    return this.http.get<ClassBooking>(`${this.apiUrl}/${id}`);
  }

  createBooking(request: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.apiUrl, request);
  }

  updateBooking(id: string, request: Partial<BookingRequest>): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${id}`, request);
  }

  cancelBooking(id: string, reason?: string): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  confirmBooking(id: string): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/${id}/confirm`, {});
  }

  completeBooking(id: string): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/${id}/complete`, {});
  }

  getAvailableSlots(teacherId: string, date: Date): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/slots`, {
      params: { teacherId, date: date.toISOString() }
    });
  }

  rescheduleBooking(id: string, newDate: Date, newStartTime: string, newEndTime: string): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/${id}/reschedule`, {
      newDate, newStartTime, newEndTime
    });
  }
}
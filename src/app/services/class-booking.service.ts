import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface ClassBooking {
  id: string;
  studentId: string;
  teacherId: string;
  subject: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  classType: 'OneTime' | 'Recurring';
  recurringDays?: string[]; // For recurring classes
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
  private apiUrl = 'api/bookings';
  
  private bookingsSubject = new BehaviorSubject<ClassBooking[]>([]);
  bookings$ = this.bookingsSubject.asObservable();

  getStudentBookings(): Observable<ClassBooking[]> {
    return this.http.get<ClassBooking[]>(`${this.apiUrl}/my-bookings`)
      .pipe(
        tap(bookings => this.bookingsSubject.next(bookings))
      );
  }

  getTeacherBookings(): Observable<ClassBooking[]> {
    return this.http.get<ClassBooking[]>(`${this.apiUrl}/teacher-bookings`)
      .pipe(
        tap(bookings => this.bookingsSubject.next(bookings))
      );
  }

  getAllBookings(): Observable<ClassBooking[]> {
    return this.http.get<ClassBooking[]>(`${this.apiUrl}`);
  }

  getBookingById(id: string): Observable<ClassBooking> {
    return this.http.get<ClassBooking>(`${this.apiUrl}/${id}`);
  }

  createBooking(request: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/create`, request);
  }

  updateBooking(id: string, request: Partial<BookingRequest>): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${id}`, request);
  }

  cancelBooking(id: string, reason?: string): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

  confirmBooking(id: string): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${id}/confirm`, {});
  }

  completeBooking(id: string): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${id}/complete`, {});
  }

  getAvailableSlots(teacherId: string, date: Date): Observable<string[]> {
    const dateStr = new Date(date).toISOString().split('T')[0];
    return this.http.get<string[]>(`${this.apiUrl}/available-slots`, {
      params: { teacherId, date: dateStr }
    });
  }

  rescheduleBooking(id: string, newDate: Date, newStartTime: string, newEndTime: string): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${id}/reschedule`, {
      newDate,
      newStartTime,
      newEndTime
    });
  }
}
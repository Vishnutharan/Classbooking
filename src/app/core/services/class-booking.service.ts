import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { ClassBooking } from '../models/shared.models';
import { environment } from '../../../environments/environment';
import { MockDataService } from './mock-data.service';
import { AuthService } from './auth.service';

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
  private mockData = inject(MockDataService);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/bookings`;

  getStudentBookings(): Observable<ClassBooking[]> {
    const studentId = this.authService.getCurrentUser()?.id;
    return this.http.get<ClassBooking[]>(this.apiUrl).pipe(
      catchError(() =>
        this.mockData.getBookings().pipe(
          map(list => studentId ? list.filter(b => b.studentId === studentId) : list),
          catchError(() => of([] as ClassBooking[]))
        )
      )
    );
  }

  getTeacherBookings(): Observable<ClassBooking[]> {
    const teacherId = this.authService.getCurrentUser()?.id;
    return this.http.get<ClassBooking[]>(this.apiUrl).pipe(
      catchError(() => this.mockData.getBookings())
    );
  }

  getAllBookings(): Observable<ClassBooking[]> {
    return this.http.get<ClassBooking[]>(this.apiUrl).pipe(
      catchError(() => this.mockData.getBookings())
    );
  }

  getBookingById(id: string): Observable<ClassBooking> {
    return this.http.get<ClassBooking>(`${this.apiUrl}/${id}`).pipe(
      catchError(() =>
        this.mockData.getBookings().pipe(
          map(list => {
            if (Array.isArray(list) && list.length) {
              return list.find(b => b.id === id) || list[0];
            }
            const now = new Date();
            return {
              id,
              studentId: 'student-mock',
              teacherId: 'teacher-mock',
              subject: 'Mathematics',
              date: now,
              startTime: '09:00',
              endTime: '10:00',
              status: 'Pending',
              classType: 'OneTime',
              createdAt: now,
              updatedAt: now
            } as ClassBooking;
          }),
          catchError(() => of({
            id,
            studentId: 'student-mock',
            teacherId: 'teacher-mock',
            subject: 'Mathematics',
            date: new Date(),
            startTime: '09:00',
            endTime: '10:00',
            status: 'Pending',
            classType: 'OneTime',
            createdAt: new Date(),
            updatedAt: new Date()
          } as ClassBooking))
        )
      )
    );
  }

  createBooking(request: BookingRequest): Observable<BookingResponse> {
    const studentId = this.authService.getCurrentUser()?.id;
    return this.http.post<BookingResponse>(this.apiUrl, request).pipe(
      catchError(() =>
        this.mockData.addBooking({ ...request, studentId }).pipe(
          catchError(() => of({ success: true, message: 'Booking saved (mock)' }))
        )
      )
    );
  }

  updateBooking(id: string, request: Partial<BookingRequest>): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${id}`, request).pipe(
      catchError(() =>
        this.mockData.rescheduleBooking(
          id,
          request.date || new Date(),
          request.startTime || '09:00',
          request.endTime || '10:00'
        )
      )
    );
  }

  cancelBooking(id: string, reason?: string): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/${id}/cancel`, { reason }).pipe(
      catchError(() => this.mockData.updateBookingStatus(id, 'Cancelled'))
    );
  }

  confirmBooking(id: string): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/${id}/confirm`, {}).pipe(
      catchError(() => this.mockData.updateBookingStatus(id, 'Confirmed'))
    );
  }

  completeBooking(id: string): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/${id}/complete`, {}).pipe(
      catchError(() => this.mockData.updateBookingStatus(id, 'Completed'))
    );
  }

  getAvailableSlots(teacherId: string, date: Date): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/slots`, {
      params: { teacherId, date: date.toISOString() }
    }).pipe(
      catchError(() => this.mockData.getAvailableSlots())
    );
  }

  rescheduleBooking(id: string, newDate: Date, newStartTime: string, newEndTime: string): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/${id}/reschedule`, {
      newDate, newStartTime, newEndTime
    }).pipe(
      catchError(() => this.mockData.rescheduleBooking(id, newDate, newStartTime, newEndTime))
    );
  }
}

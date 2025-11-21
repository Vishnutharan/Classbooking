import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

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
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  private apiUrl = 'api/bookings';
  private STORAGE_KEY = 'mock_bookings';

  private bookingsSubject = new BehaviorSubject<ClassBooking[]>([]);
  bookings$ = this.bookingsSubject.asObservable();

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadBookingsFromStorage();
  }

  private loadBookingsFromStorage() {
    if (this.isBrowser) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const bookings = JSON.parse(stored).map((b: any) => ({
          ...b,
          date: new Date(b.date),
          createdAt: new Date(b.createdAt),
          updatedAt: new Date(b.updatedAt)
        }));
        this.bookingsSubject.next(bookings);
      }
    }
  }

  private saveBookingsToStorage(bookings: ClassBooking[]) {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
      this.bookingsSubject.next(bookings);
    }
  }

  getStudentBookings(): Observable<ClassBooking[]> {
    // Return all bookings for now as we are simulating a single user environment mostly
    return of(this.bookingsSubject.value).pipe(delay(500));
  }

  getTeacherBookings(): Observable<ClassBooking[]> {
    return of(this.bookingsSubject.value).pipe(delay(500));
  }

  getAllBookings(): Observable<ClassBooking[]> {
    return of(this.bookingsSubject.value).pipe(delay(500));
  }

  getBookingById(id: string): Observable<ClassBooking> {
    const booking = this.bookingsSubject.value.find(b => b.id === id);
    if (!booking) return throwError(() => new Error('Booking not found'));
    return of(booking).pipe(delay(300));
  }

  createBooking(request: BookingRequest): Observable<BookingResponse> {
    const newBooking: ClassBooking = {
      id: 'bk-' + Date.now(),
      studentId: 'current-user-id', // Mock ID
      teacherId: request.teacherId,
      subject: request.subject,
      date: request.date,
      startTime: request.startTime,
      endTime: request.endTime,
      status: 'Confirmed', // Auto-confirm for demo
      classType: request.classType,
      recurringDays: request.recurringDays,
      notes: request.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentBookings = this.bookingsSubject.value;
    const updatedBookings = [...currentBookings, newBooking];
    this.saveBookingsToStorage(updatedBookings);

    return of({
      success: true,
      message: 'Booking created successfully',
      booking: newBooking
    }).pipe(delay(800));
  }

  updateBooking(id: string, request: Partial<BookingRequest>): Observable<BookingResponse> {
    const currentBookings = this.bookingsSubject.value;
    const index = currentBookings.findIndex(b => b.id === id);

    if (index === -1) return throwError(() => new Error('Booking not found'));

    const updatedBooking = {
      ...currentBookings[index],
      ...request,
      updatedAt: new Date()
    };

    currentBookings[index] = updatedBooking;
    this.saveBookingsToStorage(currentBookings);

    return of({
      success: true,
      message: 'Booking updated successfully',
      booking: updatedBooking
    }).pipe(delay(500));
  }

  cancelBooking(id: string, reason?: string): Observable<BookingResponse> {
    const currentBookings = this.bookingsSubject.value;
    const index = currentBookings.findIndex(b => b.id === id);

    if (index === -1) return throwError(() => new Error('Booking not found'));

    const updatedBooking = {
      ...currentBookings[index],
      status: 'Cancelled' as const,
      updatedAt: new Date()
    };

    currentBookings[index] = updatedBooking;
    this.saveBookingsToStorage(currentBookings);

    return of({
      success: true,
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    }).pipe(delay(500));
  }

  confirmBooking(id: string): Observable<BookingResponse> {
    const currentBookings = this.bookingsSubject.value;
    const index = currentBookings.findIndex(b => b.id === id);

    if (index === -1) return throwError(() => new Error('Booking not found'));

    const updatedBooking = {
      ...currentBookings[index],
      status: 'Confirmed' as const,
      updatedAt: new Date()
    };

    currentBookings[index] = updatedBooking;
    this.saveBookingsToStorage(currentBookings);

    return of({
      success: true,
      message: 'Booking confirmed successfully',
      booking: updatedBooking
    }).pipe(delay(500));
  }

  completeBooking(id: string): Observable<BookingResponse> {
    const currentBookings = this.bookingsSubject.value;
    const index = currentBookings.findIndex(b => b.id === id);

    if (index === -1) return throwError(() => new Error('Booking not found'));

    const updatedBooking = {
      ...currentBookings[index],
      status: 'Completed' as const,
      updatedAt: new Date()
    };

    currentBookings[index] = updatedBooking;
    this.saveBookingsToStorage(currentBookings);

    return of({
      success: true,
      message: 'Booking completed successfully',
      booking: updatedBooking
    }).pipe(delay(500));
  }

  getAvailableSlots(teacherId: string, date: Date): Observable<string[]> {
    // Mock available slots
    const slots = [
      '08:00', '09:00', '10:00', '11:00',
      '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
    ];

    // Randomly remove some slots to simulate availability
    const availableSlots = slots.filter(() => Math.random() > 0.3);

    return of(availableSlots).pipe(delay(600));
  }

  rescheduleBooking(id: string, newDate: Date, newStartTime: string, newEndTime: string): Observable<BookingResponse> {
    const currentBookings = this.bookingsSubject.value;
    const index = currentBookings.findIndex(b => b.id === id);

    if (index === -1) return throwError(() => new Error('Booking not found'));

    const updatedBooking = {
      ...currentBookings[index],
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      status: 'Confirmed' as const,
      updatedAt: new Date()
    };

    currentBookings[index] = updatedBooking;
    this.saveBookingsToStorage(currentBookings);

    return of({
      success: true,
      message: 'Booking rescheduled successfully',
      booking: updatedBooking
    }).pipe(delay(500));
  }
}
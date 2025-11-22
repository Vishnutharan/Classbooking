import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DemoDataService } from './demo-data.service';
import { ClassBooking } from '../models/shared.models';
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
  private demoData = inject(DemoDataService);
  private authService = inject(AuthService);

  getStudentBookings(): Observable<ClassBooking[]> {
    const user = this.authService.getCurrentUser();
    if (!user) return throwError(() => new Error('User not authenticated'));

    // Filter for current student
    const bookings = this.demoData.getBookings().filter(b => b.studentId === user.id);
    return of(bookings).pipe(delay(500));
  }

  getTeacherBookings(): Observable<ClassBooking[]> {
    const user = this.authService.getCurrentUser();
    if (!user) return throwError(() => new Error('User not authenticated'));

    // Filter for current teacher
    const bookings = this.demoData.getBookings().filter(b => b.teacherId === user.id);
    return of(bookings).pipe(delay(500));
  }

  getAllBookings(): Observable<ClassBooking[]> {
    return of(this.demoData.getBookings()).pipe(delay(500));
  }

  getBookingById(id: string): Observable<ClassBooking> {
    const booking = this.demoData.getBookings().find(b => b.id === id);
    if (!booking) return throwError(() => new Error('Booking not found'));
    return of(booking).pipe(delay(300));
  }

  createBooking(request: BookingRequest): Observable<BookingResponse> {
    const user = this.authService.getCurrentUser();
    if (!user) return throwError(() => new Error('User not authenticated'));

    const newBooking: ClassBooking = {
      id: 'bk-' + Date.now(),
      studentId: user.id,
      teacherId: request.teacherId,
      subject: request.subject,
      date: request.date,
      startTime: request.startTime,
      endTime: request.endTime,
      status: 'Confirmed', // Auto-confirm for demo
      classType: request.classType,
      recurringDays: request.recurringDays,
      notes: request.notes,
      meetingLink: 'https://meet.google.com/new-class-link', // Mock link
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.demoData.addBooking(newBooking);

    return of({
      success: true,
      message: 'Booking created successfully',
      booking: newBooking
    }).pipe(delay(800));
  }

  updateBooking(id: string, request: Partial<BookingRequest>): Observable<BookingResponse> {
    const booking = this.demoData.getBookings().find(b => b.id === id);
    if (!booking) return throwError(() => new Error('Booking not found'));

    const updatedBooking = {
      ...booking,
      ...request,
      updatedAt: new Date()
    };

    this.demoData.updateBooking(updatedBooking);

    return of({
      success: true,
      message: 'Booking updated successfully',
      booking: updatedBooking
    }).pipe(delay(500));
  }

  cancelBooking(id: string, reason?: string): Observable<BookingResponse> {
    const booking = this.demoData.getBookings().find(b => b.id === id);
    if (!booking) return throwError(() => new Error('Booking not found'));

    const updatedBooking: ClassBooking = {
      ...booking,
      status: 'Cancelled',
      updatedAt: new Date()
    };

    this.demoData.updateBooking(updatedBooking);

    return of({
      success: true,
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    }).pipe(delay(500));
  }

  confirmBooking(id: string): Observable<BookingResponse> {
    const booking = this.demoData.getBookings().find(b => b.id === id);
    if (!booking) return throwError(() => new Error('Booking not found'));

    const updatedBooking: ClassBooking = {
      ...booking,
      status: 'Confirmed',
      updatedAt: new Date()
    };

    this.demoData.updateBooking(updatedBooking);

    return of({
      success: true,
      message: 'Booking confirmed successfully',
      booking: updatedBooking
    }).pipe(delay(500));
  }

  completeBooking(id: string): Observable<BookingResponse> {
    const booking = this.demoData.getBookings().find(b => b.id === id);
    if (!booking) return throwError(() => new Error('Booking not found'));

    const updatedBooking: ClassBooking = {
      ...booking,
      status: 'Completed',
      updatedAt: new Date()
    };

    this.demoData.updateBooking(updatedBooking);

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
    const booking = this.demoData.getBookings().find(b => b.id === id);
    if (!booking) return throwError(() => new Error('Booking not found'));

    const updatedBooking: ClassBooking = {
      ...booking,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      status: 'Confirmed',
      updatedAt: new Date()
    };

    this.demoData.updateBooking(updatedBooking);

    return of({
      success: true,
      message: 'Booking rescheduled successfully',
      booking: updatedBooking
    }).pipe(delay(500));
  }
}
import { Injectable, inject } from '@angular/core';
import { StoreService } from './store.service';
import { ClassBookingService } from './class-booking.service';
import { TeacherService } from './teacher.service';
import { StudentService } from './student.service';
import { AuthService } from './auth.service';
import { forkJoin, tap, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateManagementService {
  private store = inject(StoreService);
  private authService = inject(AuthService);
  private bookingService = inject(ClassBookingService);
  private teacherService = inject(TeacherService);
  private studentService = inject(StudentService);

  // Orchestrate initial data load based on role
  loadInitialData(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.store.setLoading(true);
    this.store.setCurrentUser(user);

    if (user.role === 'Student') {
      this.loadStudentData();
    } else if (user.role === 'Teacher') {
      this.loadTeacherData();
    } else if (user.role === 'Admin') {
      this.loadAdminData();
    }
  }

  private loadStudentData(): void {
    forkJoin({
      bookings: this.bookingService.getStudentBookings(),
      // mock profile fetch as student service relies on auth
    }).pipe(
      finalize(() => this.store.setLoading(false))
    ).subscribe({
      next: (data) => {
        this.store.setBookings(data.bookings);
      }
    });
  }

  private loadTeacherData(): void {
    forkJoin({
      bookings: this.bookingService.getTeacherBookings(),
      profile: this.teacherService.getMyProfile()
    }).pipe(
      finalize(() => this.store.setLoading(false))
    ).subscribe({
      next: (data) => {
        this.store.setBookings(data.bookings);
      }
    });
  }

  private loadAdminData(): void {
    forkJoin({
      teachers: this.teacherService.getAllTeachers(),
      bookings: this.bookingService.getAllBookings()
    }).pipe(
      finalize(() => this.store.setLoading(false))
    ).subscribe({
      next: (data) => {
        this.store.setTeachers(data.teachers);
        this.store.setBookings(data.bookings);
      }
    });
  }

  // Action to refresh specific slice of state
  refreshBookings(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    
    const req$ = user.role === 'Teacher' 
      ? this.bookingService.getTeacherBookings() 
      : this.bookingService.getStudentBookings();

    req$.subscribe(bookings => this.store.setBookings(bookings));
  }
}
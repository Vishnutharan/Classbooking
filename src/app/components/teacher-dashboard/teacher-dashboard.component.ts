import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from '../../core/services/teacher.service';
import { ClassBookingService } from '../../core/services/class-booking.service';
import { TeacherProfile, ClassBooking, TimetableEvent } from '../../core/models/shared.models';
import { NotificationService } from '../../core/services/notification.service';
import { TimetableService } from '../../core/services/timetable.service';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})

export class TeacherDashboardComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private bookingService = inject(ClassBookingService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private timetableService = inject(TimetableService);
  private authService = inject(AuthService);

  teacherProfile: TeacherProfile | null = null;
  upcomingClasses: ClassBooking[] = [];
  completedClasses: ClassBooking[] = [];
  pendingRequests: ClassBooking[] = [];
  recentReviews: any[] = [];
  isLoading = false;
  timetableEvents: TimetableEvent[] = [];

  stats = {
    totalStudents: 0,
    completedClasses: 0,
    averageRating: 0,
    monthlyEarnings: 0
  };

  weekStats = {
    classesThisWeek: 0,
    earningsThisWeek: 0,
    studentsThisWeek: 0
  };

  monthlyEarnings: any[] = [];
  today = new Date();

  ratingWidth(value: number): number {
    const safe = Number.isFinite(value) ? value : 0;
    return Math.min(Math.max(safe * 20, 0), 100);
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    // Only load data on the browser, not during SSR
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    }
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      profile: this.teacherService.getMyProfile(),
      bookings: this.bookingService.getTeacherBookings(),
      timetable: this.timetableService.getTimetableForUser()
    }).subscribe({
      next: ({ profile, bookings, timetable }) => {
        this.teacherProfile = profile;
        this.timetableEvents = (timetable || []).slice(0, 5);

        this.populateBookingCollections(bookings);
        this.stats.averageRating = profile.averageRating || 0;
        this.stats.completedClasses = this.completedClasses.length;
        this.stats.totalStudents = this.getUniqueStudentCount(bookings);
        this.stats.monthlyEarnings = this.calculateMonthlyEarnings(bookings);

        this.weekStats.classesThisWeek = this.getWeekClasses(bookings);
        this.weekStats.studentsThisWeek = this.getUniqueStudentsThisWeek(bookings);
        this.weekStats.earningsThisWeek = this.calculateEarnings(bookings, 7);

        this.updateMonthlyTrend(bookings);
        this.loadReviews(profile.id);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load your dashboard');
      }
    });
  }

  private loadReviews(teacherId: string): void {
    if (!teacherId) {
      this.recentReviews = [];
      return;
    }

    this.teacherService.getTeacherReviews(teacherId).subscribe({
      next: (reviews) => {
        this.recentReviews = (reviews || []).map(r => ({
          ...r,
          text: r.comment || r.text || '',
          date: new Date(r.createdAt || r.date)
        })).slice(0, 5);
      },
      error: () => {
        this.recentReviews = [];
      }
    });
  }

  private populateBookingCollections(bookings: ClassBooking[]): void {
    this.upcomingClasses = bookings
      .filter(b => b.status === 'Confirmed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    this.completedClasses = bookings.filter(b => b.status === 'Completed');
    this.pendingRequests = bookings.filter(b => b.status === 'Pending').slice(0, 3);
  }

  private calculateMonthlyEarnings(bookings: ClassBooking[]): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return bookings
      .filter(b => {
        const date = new Date(b.date);
        return date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear &&
          b.status === 'Completed';
      })
      .reduce((sum, b) => sum + this.getBookingEarnings(b), 0);
  }

  private calculateEarnings(bookings: ClassBooking[], lastNDays: number): number {
    const now = new Date();
    const cutoff = new Date(now.getTime() - lastNDays * 24 * 60 * 60 * 1000);

    return bookings
      .filter(b => {
        const date = new Date(b.date);
        return date >= cutoff && date <= now && b.status === 'Completed';
      })
      .reduce((sum, b) => sum + this.getBookingEarnings(b), 0);
  }

  private getWeekClasses(bookings: ClassBooking[]): number {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return bookings.filter(b => {
      const date = new Date(b.date);
      return date >= weekAgo && date <= now;
    }).length;
  }

  private getUniqueStudentsThisWeek(bookings: ClassBooking[]): number {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const ids = bookings
      .filter(b => {
        const date = new Date(b.date);
        return date >= weekAgo && date <= now;
      })
      .map(b => b.studentId);

    return new Set(ids).size;
  }

  private getUniqueStudentCount(bookings: ClassBooking[]): number {
    return new Set(bookings.map(b => b.studentId)).size;
  }

  private getBookingEarnings(booking: ClassBooking): number {
    const [startHour, startMinute = 0] = booking.startTime.split(':').map(Number);
    const [endHour, endMinute = 0] = booking.endTime.split(':').map(Number);
    const start = startHour + startMinute / 60;
    const end = endHour + endMinute / 60;
    const hours = Math.max(end - start, 0);
    return hours * (this.teacherProfile?.hourlyRate || 0);
  }

  private updateMonthlyTrend(bookings: ClassBooking[]): void {
    const now = new Date();
    const months = Array.from({ length: 6 }).map((_, idx) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      return {
        label: date.toLocaleString('en-US', { month: 'short' }),
        month: date.getMonth(),
        year: date.getFullYear()
      };
    });

    this.monthlyEarnings = months.map(({ label, month, year }) => {
      const earnings = bookings
        .filter(b => {
          const bookingDate = new Date(b.date);
          return bookingDate.getMonth() === month &&
            bookingDate.getFullYear() === year &&
            b.status === 'Completed';
        })
        .reduce((sum, b) => sum + this.getBookingEarnings(b), 0);

      return { month: label, earnings };
    });
  }

  getBarHeight(earnings: number): number {
    const max = Math.max(...this.monthlyEarnings.map(m => m.earnings || 0), 1);
    const height = (earnings / max) * 100;
    return Math.max(height, 6);
  }

  acceptRequest(booking: ClassBooking): void {
    this.bookingService.confirmBooking(booking.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Booking accepted');
        this.loadDashboardData();
      }
    });
  }

  rejectRequest(booking: ClassBooking): void {
    this.bookingService.cancelBooking(booking.id, 'Teacher rejected').subscribe({
      next: () => {
        this.notificationService.showSuccess('Booking rejected');
        this.loadDashboardData();
      }
    });
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}

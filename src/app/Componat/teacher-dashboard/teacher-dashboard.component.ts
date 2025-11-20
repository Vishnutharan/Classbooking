import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherProfile, TeacherService } from '../../Service/teacher.service';
import { ClassBooking, ClassBookingService } from '../../Service/class-booking.service';
import { NotificationService } from '../../Service/notification.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})

export class TeacherDashboardComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private bookingService = inject(ClassBookingService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  teacherProfile: TeacherProfile | null = null;
  upcomingClasses: ClassBooking[] = [];
  completedClasses: ClassBooking[] = [];
  pendingRequests: ClassBooking[] = [];
  recentReviews: any[] = [];
  isLoading = false;

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

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    this.teacherService.getMyProfile().subscribe({
      next: (profile) => {
        this.teacherProfile = profile;
        this.stats.totalStudents = profile.totalClasses;
        this.stats.averageRating = profile.averageRating;

        // Now we have the ID, so load reviews here
        this.teacherService.getTeacherReviews(profile.id).subscribe({
          next: (reviews) => {
            this.recentReviews = reviews.slice(0, 5);
          }
        });
      }
    });

    this.bookingService.getTeacherBookings().subscribe({
      next: (bookings) => {
        this.upcomingClasses = bookings
          .filter(b => b.status === 'Confirmed')
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5);

        this.completedClasses = bookings.filter(b => b.status === 'Completed');
        this.pendingRequests = bookings.filter(b => b.status === 'Pending').slice(0, 3);

        this.stats.completedClasses = this.completedClasses.length;
        this.stats.monthlyEarnings = this.calculateMonthlyEarnings(bookings);
        this.weekStats.classesThisWeek = this.getWeekClasses(bookings);
        this.updateMonthlyTrend(bookings);

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load bookings');
      }
    });

    this.teacherService.getTeacherReviews(this.teacherProfile?.id || '').subscribe({
      next: (reviews) => {
        this.recentReviews = reviews.slice(0, 5);
      },
      complete: () => {
        this.isLoading = false;
      }
    });

  }

  private calculateMonthlyEarnings(bookings: ClassBooking[]): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return bookings
      .filter(b => {
        const date = new Date(b.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear && b.status === 'Completed';
      })
      .reduce((sum, b) => {
        const [startHour] = b.startTime.split(':').map(Number);
        const [endHour] = b.endTime.split(':').map(Number);
        const hours = endHour - startHour;
        return sum + (hours * (this.teacherProfile?.hourlyRate || 0));
      }, 0);
  }

  private getWeekClasses(bookings: ClassBooking[]): number {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return bookings.filter(b => {
      const date = new Date(b.date);
      return date >= weekAgo && date <= now;
    }).length;
  }

  private updateMonthlyTrend(bookings: ClassBooking[]): void {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    this.monthlyEarnings = months.map((month, index) => ({
      month,
      earnings: Math.floor(Math.random() * 50000) + 20000
    }));
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
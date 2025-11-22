import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../core/services/student.service';
import { TeacherService } from '../../core/services/teacher.service';
import { ClassBookingService } from '../../core/services/class-booking.service';
import { TeacherProfile, ClassBooking } from '../../core/models/shared.models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  private studentService = inject(StudentService);
  private bookingService = inject(ClassBookingService);
  private teacherService = inject(TeacherService);
  private router = inject(Router);

  upcomingClasses: ClassBooking[] = [];
  recommendedTeachers: TeacherProfile[] = [];
  stats = {
    totalClassesBooked: 0,
    completedClasses: 0,
    hoursStudied: 0,
    averageRating: 0,
    progressPercentage: 0
  };
  recentActivity: any[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    this.bookingService.getStudentBookings().subscribe({
      next: (bookings) => {
        this.upcomingClasses = bookings
          .filter(b => b.status === 'Confirmed')
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5);

        this.stats.totalClassesBooked = bookings.length;
        this.stats.completedClasses = bookings.filter(b => b.status === 'Completed').length;
        this.stats.hoursStudied = this.calculateHours(bookings);
      }
    });

    this.studentService.getRecommendedTeachers().subscribe({
      next: (teachers) => {
        this.recommendedTeachers = teachers.slice(0, 6);
      }
    });

    this.studentService.getProgressReport().subscribe({
      next: (report) => {
        this.recentActivity = report.activities || [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private calculateHours(bookings: ClassBooking[]): number {
    return bookings
      .filter(b => b.status === 'Completed')
      .reduce((sum, b) => {
        const start = new Date(`2000-01-01 ${b.startTime}`);
        const end = new Date(`2000-01-01 ${b.endTime}`);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0);
  }

  bookClass(): void {
    this.router.navigate(['/book-class']);
  }

  viewExamMaterials(): void {
    this.router.navigate(['/exam-materials']);
  }

  seePastPapers(): void {
    this.router.navigate(['/past-papers']);
  }

  viewTeacherProfile(teacherId: string): void {
    this.router.navigate(['/teacher-profile', teacherId]);
  }

  viewBooking(bookingId: string): void {
    this.router.navigate(['/my-bookings']);
  }

  viewMyProgress(): void {
    this.router.navigate(['/student/progress']);
  }

  viewMyReviews(): void {
    this.router.navigate(['/my-reviews']);
  }
}

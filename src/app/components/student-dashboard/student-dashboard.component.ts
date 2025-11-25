import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../core/services/student.service';
import { TeacherService } from '../../core/services/teacher.service';
import { ClassBookingService } from '../../core/services/class-booking.service';
import { TeacherProfile, ClassBooking } from '../../core/models/shared.models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  private studentService = inject(StudentService);
  private bookingService = inject(ClassBookingService);
  private teacherService = inject(TeacherService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  upcomingClasses: ClassBooking[] = [];
  recommendedTeachers: TeacherProfile[] = [];

  // Search & Filter
  allTeachers: TeacherProfile[] = [];
  filteredTeachers: TeacherProfile[] = [];
  searchFilters = {
    subject: '',
    level: '',
    medium: ''
  };

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
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    }
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

    // Load all teachers for search/filter
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers) => {
        this.allTeachers = teachers;
        this.filteredTeachers = teachers;
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

  applyFilters(): void {
    this.filteredTeachers = this.allTeachers.filter(teacher => {
      const matchesSubject = !this.searchFilters.subject ||
        teacher.subjects.some(s => s.name.toLowerCase().includes(this.searchFilters.subject.toLowerCase()));

      const matchesLevel = !this.searchFilters.level ||
        teacher.subjects.some(s => s.level === this.searchFilters.level);

      const matchesMedium = !this.searchFilters.medium ||
        teacher.subjects.some(s => s.medium === this.searchFilters.medium);

      return matchesSubject && matchesLevel && matchesMedium;
    });
  }

  clearFilters(): void {
    this.searchFilters = {
      subject: '',
      level: '',
      medium: ''
    };
    this.filteredTeachers = this.allTeachers;
  }
}
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClassBookingService } from '../../core/services/class-booking.service';
import { StudentService } from '../../core/services/student.service';
import { NotificationService } from '../../core/services/notification.service';

interface LessonPlanView {
  id: string;
  title: string;
  subject: string;
  level?: string;
  description?: string;
  scheduledDate?: Date;
  durationMinutes?: number;
  status: string;
}

interface TeacherOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-student-lesson-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-lesson-plans.component.html',
  styleUrl: './student-lesson-plans.component.css'
})
export class StudentLessonPlansComponent implements OnInit {
  private bookingService = inject(ClassBookingService);
  private studentService = inject(StudentService);
  private notificationService = inject(NotificationService);

  teachers: TeacherOption[] = [];
  selectedTeacherId = '';
  lessonPlans: LessonPlanView[] = [];
  isLoading = false;
  bookingsLoading = false;

  ngOnInit(): void {
    this.loadTeachersFromBookings();
  }

  private loadTeachersFromBookings(): void {
    this.bookingsLoading = true;
    this.bookingService.getStudentBookings().subscribe({
      next: (bookings) => {
        const map = new Map<string, string>();
        bookings
          .filter(b => b.teacherId && (b.status === 'Confirmed' || b.status === 'Completed'))
          .forEach(b => {
            if (!map.has(b.teacherId)) {
              map.set(b.teacherId, b.teacherName || 'Teacher');
            }
          });
        this.teachers = Array.from(map.entries()).map(([id, name]) => ({ id, name }));
        this.bookingsLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load your teachers');
        this.bookingsLoading = false;
      }
    });
  }

  onTeacherChange(): void {
    if (!this.selectedTeacherId) {
      this.lessonPlans = [];
      return;
    }
    this.fetchLessonPlans(this.selectedTeacherId);
  }

  private fetchLessonPlans(teacherId: string): void {
    this.isLoading = true;
    this.lessonPlans = [];

    this.studentService.getLessonPlansForTeacher(teacherId).subscribe({
      next: (plans) => {
        this.lessonPlans = (plans || []).map(p => ({
          id: p.id,
          title: p.title,
          subject: p.subject,
          level: p.level,
          description: p.description,
          durationMinutes: p.durationMinutes,
          scheduledDate: p.scheduledDate ? new Date(p.scheduledDate) : undefined,
          status: p.status
        }));
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load lesson plans');
        this.isLoading = false;
      }
    });
  }
}

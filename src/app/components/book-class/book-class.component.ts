import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherProfile, TeacherService } from '../../services/teacher.service';
import { BookingRequest, ClassBookingService } from '../../services/class-booking.service';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-book-class',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-class.component.html',
  styleUrl: './book-class.component.css'
})
export class BookClassComponent implements OnInit {
  private fb = inject(FormBuilder);
  private teacherService = inject(TeacherService);
  private bookingService = inject(ClassBookingService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  bookingForm!: FormGroup;
  teachers: TeacherProfile[] = [];
  filteredTeachers: TeacherProfile[] = [];
  selectedTeacher: TeacherProfile | null = null;
  availableSlots: string[] = [];
  showConfirmation = false;
  isLoading = false;
  bookingReference = '';

  subjects: string[] = [];
  levels: string[] = ['Primary', 'Secondary', 'Advanced'];
  durations = [30, 45, 60];
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  recurringDays: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.initForm();
    this.loadTeachers();
  }

  private initForm(): void {
    this.bookingForm = this.fb.group({
      teacherId: ['', Validators.required],
      subject: ['', Validators.required],
      level: [''],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      duration: [60, Validators.required],
      classType: ['OneTime', Validators.required],
      notes: [''],
      minRating: [0]
    });

    this.days.forEach(day => {
      this.recurringDays[day] = false;
    });
  }

  private loadTeachers(): void {
    this.isLoading = true;
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers) => {
        this.teachers = teachers;
        this.filteredTeachers = teachers;
        this.extractSubjects();
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load teachers');
        this.isLoading = false;
      }
    });
  }

  private extractSubjects(): void {
    const subjectsSet = new Set<string>();
    this.teachers.forEach(t => {
      t.subjects.forEach(s => subjectsSet.add(s.name));
    });
    this.subjects = Array.from(subjectsSet);
  }

  filterTeachers(): void {
    const searchTerm = this.bookingForm.get('subject')?.value?.toLowerCase() || '';
    const minRating = this.bookingForm.get('minRating')?.value || 0;
    const level = this.bookingForm.get('level')?.value || '';

    this.filteredTeachers = this.teachers.filter(teacher => {
      const matchesSubject = teacher.subjects.some(s =>
        s.name.toLowerCase().includes(searchTerm)
      );
      const matchesRating = teacher.averageRating >= minRating;
      const matchesLevel = !level || teacher.subjects.some(s => s.level === level);
      return matchesSubject && matchesRating && matchesLevel;
    });
  }

  getTeacherSubjects(teacher: TeacherProfile): string {
    return teacher.subjects.map(s => s.name).join(', ');
  }

  selectTeacher(teacher: TeacherProfile): void {
    this.selectedTeacher = teacher;
    this.bookingForm.patchValue({ teacherId: teacher.id });
  }

  onDateChange(): void {
    const date = this.bookingForm.get('date')?.value;
    const teacherId = this.bookingForm.get('teacherId')?.value;

    if (date && teacherId) {
      this.bookingService.getAvailableSlots(teacherId, new Date(date)).subscribe({
        next: (slots) => {
          this.availableSlots = slots;
        }
      });
    }
  }

  toggleRecurringDay(day: string): void {
    this.recurringDays[day] = !this.recurringDays[day];
  }

  getSelectedRecurringDays(): string[] {
    return Object.keys(this.recurringDays).filter(day => this.recurringDays[day]);
  }

  openConfirmation(): void {
    if (this.bookingForm.invalid) {
      this.notificationService.showError('Please fill all required fields');
      return;
    }
    this.showConfirmation = true;
  }

  closeConfirmation(): void {
    this.showConfirmation = false;
  }

  submitBooking(): void {
    if (this.bookingForm.invalid) return;

    this.isLoading = true;
    const formValue = this.bookingForm.value;
    const classType = formValue.classType;

    const startTime = formValue.startTime;
    const [hours, minutes] = startTime.split(':');
    const endHours = parseInt(hours) + Math.floor((parseInt(minutes) + formValue.duration) / 60);
    const endMinutes = (parseInt(minutes) + formValue.duration) % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

    const bookingRequest: BookingRequest = {
      teacherId: formValue.teacherId,
      subject: formValue.subject,
      date: new Date(formValue.date),
      startTime: startTime,
      endTime: endTime,
      classType: classType,
      recurringDays: classType === 'Recurring' ? this.getSelectedRecurringDays() : undefined,
      notes: formValue.notes
    };

    this.bookingService.createBooking(bookingRequest).subscribe({
      next: (response) => {
        this.bookingReference = response.booking?.id || 'REF-' + Date.now();
        this.notificationService.showSuccess(`Booking confirmed! Reference: ${this.bookingReference}`);
        setTimeout(() => {
          this.router.navigate(['/my-bookings']);
        }, 2000);
      },
      error: (error) => {
        this.notificationService.showError(error.message || 'Booking failed');
        this.isLoading = false;
      }
    });
  }

  getTotalAmount(): number {
    if (!this.selectedTeacher) return 0;
    const duration = this.bookingForm.get('duration')?.value || 0;
    return (this.selectedTeacher.hourlyRate * duration) / 60;
  }
}

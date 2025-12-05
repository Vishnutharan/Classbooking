import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { ClassBookingService, BookingRequest } from '../../core/services/class-booking.service';
import { TeacherService } from '../../core/services/teacher.service';
import { CalendarComponent } from '../shared/calendar/calendar.component';
import { EventInput, EventClickArg } from '@fullcalendar/core';
import { TeacherAvailabilitySlot, TeacherProfile } from '../../core/models/shared.models';

@Component({
  selector: 'app-book-class',
  standalone: true,
  imports: [CommonModule, CalendarComponent, FormsModule],
  templateUrl: './book-class.component.html',
  styleUrl: './book-class.component.css'
})
export class BookClassComponent implements OnInit {
  private bookingService = inject(ClassBookingService);
  private teacherService = inject(TeacherService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  calendarEvents: EventInput[] = [];
  currentUser: any;
  teachers: TeacherProfile[] = [];
  selectedTeacherId = '';
  selectedTeacher?: TeacherProfile;
  availabilitySlots: TeacherAvailabilitySlot[] = [];

  showBookingDialog = false;
  selectedSlot: any = null;
  bookingForm = {
    subject: '',
    notes: '',
    classType: 'Personal_1_1' as 'Personal_1_1' | 'Group' | 'OneTime' | 'Recurring',
    mode: 'ONLINE' as 'ONLINE' | 'IN_PERSON',
    gradeLevel: ''
  };

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers) => {
        this.teachers = teachers;
      },
      error: () => this.notificationService.showError('Failed to load teachers')
    });
  }

  refreshSelectedTeacher(): void {
    if (this.selectedTeacherId) {
      this.onTeacherSelected(this.selectedTeacherId);
    } else {
      this.notificationService.showInfo('Select a teacher to view their schedule');
    }
  }

  onTeacherSelected(teacherId: string): void {
    this.selectedTeacherId = teacherId;
    this.selectedTeacher = this.teachers.find(t => t.id === teacherId);
    this.selectedSlot = null;
    this.calendarEvents = [];

    if (!teacherId) {
      return;
    }

    const startRange = new Date();
    const endRange = new Date();
    endRange.setDate(endRange.getDate() + 30);

    this.teacherService.getTeacherAvailabilitySlots(teacherId, startRange, endRange).subscribe({
      next: (slots) => {
        this.availabilitySlots = slots;
        this.calendarEvents = this.generateEventsForTeacher(slots);
      },
      error: () => this.notificationService.showError('Failed to load availability for this teacher')
    });
  }

  private generateEventsForTeacher(slots: TeacherAvailabilitySlot[]): EventInput[] {
    const teacher = this.selectedTeacher;

    return slots.map(slot => {
      const status = slot.status || 'Available';
      const isAvailable = status === 'Available';
      const color = isAvailable ? '#28a745' : status === 'Pending' ? '#ffc107' : '#6c757d';
      const dateStr = this.formatDate(slot.date);

      return {
        id: `slot-${slot.id}`,
        title: `${teacher?.fullName || 'Teacher'} - ${status}`,
        start: `${dateStr}T${slot.startTime}`,
        end: `${dateStr}T${slot.endTime}`,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          type: 'slot',
          slotId: slot.id,
          status,
          teacherId: this.selectedTeacherId,
          teacherName: teacher?.fullName,
          teacherRate: teacher?.hourlyRate,
          subjects: teacher?.subjects || [],
          date: dateStr,
          startTime: slot.startTime,
          endTime: slot.endTime
        }
      };
    });
  }

  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onEventClicked(arg: EventClickArg): void {
    const props = arg.event.extendedProps;

    if (!this.selectedTeacherId) {
      this.notificationService.showWarning('Please choose a teacher first');
      return;
    }

    if (!this.currentUser) {
      this.notificationService.showWarning('Please login to book a class');
      return;
    }

    if (props['type'] !== 'slot') {
      this.notificationService.showWarning('Select a green slot to book');
      return;
    }

    if (props['status'] !== 'Available') {
      this.notificationService.showWarning('This slot is already taken or awaiting approval');
      return;
    }

    this.selectedSlot = props;
    this.showBookingDialog = true;

    if (props['subjects'] && props['subjects'].length > 0) {
      this.bookingForm.subject = props['subjects'][0].name;
    }
  }

  confirmBooking(): void {
    if (!this.bookingForm.subject) {
      this.notificationService.showWarning('Please select a subject');
      return;
    }

    const bookingRequest: BookingRequest = {
      teacherId: this.selectedSlot.teacherId,
      subject: this.bookingForm.subject,
      date: new Date(this.selectedSlot.date),
      startTime: this.selectedSlot.startTime,
      endTime: this.selectedSlot.endTime,
      classType: this.bookingForm.classType as any, 
      mode: this.bookingForm.mode,
      bookingGradeLevel: this.bookingForm.gradeLevel,
      notes: this.bookingForm.notes
    };

    this.bookingService.createBooking(bookingRequest).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(response.message);
        this.closeBookingDialog();
        this.onTeacherSelected(this.selectedTeacherId);
        setTimeout(() => {
          this.router.navigate(['/my-bookings']);
        }, 1000);
      },
      error: (err) => {
        const message = err?.error?.message || 'Failed to create booking';
        this.notificationService.showError(message);
      }
    });
  }

  closeBookingDialog(): void {
    this.showBookingDialog = false;
    this.selectedSlot = null;
    this.bookingForm = {
      subject: '',
      notes: '',
      classType: 'Personal_1_1',
      mode: 'ONLINE',
      gradeLevel: ''
    };
  }
}

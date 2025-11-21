import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { ClassBookingService, BookingRequest } from '../../services/class-booking.service';
import { TeacherService } from '../../services/teacher.service';
import { CalendarComponent } from '../shared/calendar/calendar.component';
import { EventInput, EventClickArg } from '@fullcalendar/core';
import { TeacherProfile } from '../../models/shared.models';


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

  // Booking dialog state
  showBookingDialog = false;
  selectedSlot: any = null;
  bookingForm = {
    subject: '',
    notes: '',
    classType: 'OneTime' as 'OneTime' | 'Recurring'
  };

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadAvailableClasses();
  }

  public loadAvailableClasses(): void {
    // Load teachers and their availability
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers) => {
        this.teachers = teachers;
        this.generateCalendarEvents(teachers);
      },
      error: () => {
        this.notificationService.showError('Failed to load available teachers');
      }
    });

    // Also load existing bookings to show as grey
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        const bookingEvents = bookings.map(b => ({
          id: 'booking-' + b.id,
          title: `${b.subject} - ${b.status}`,
          start: `${this.formatDate(b.date)}T${b.startTime}`,
          end: `${this.formatDate(b.date)}T${b.endTime}`,
          backgroundColor: '#6c757d',
          borderColor: '#6c757d',
          extendedProps: {
            type: 'booking',
            status: b.status,
            teacherId: b.teacherId,
            studentId: b.studentId
          }
        }));
        this.calendarEvents = [...this.calendarEvents, ...bookingEvents];
      }
    });
  }

  private generateCalendarEvents(teachers: TeacherProfile[]): void {
    const events: EventInput[] = [];
    const today = new Date();

    // Generate slots for the next 30 days based on teacher availability
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + dayOffset);
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      const dateStr = this.formatDate(currentDate);

      teachers.forEach(teacher => {
        teacher.availability.forEach(avail => {
          if (avail.dayOfWeek.toLowerCase() === dayName.toLowerCase()) {
            // Create hourly slots within availability window
            const startHour = parseInt(avail.startTime.split(':')[0]);
            const endHour = parseInt(avail.endTime.split(':')[0]);

            for (let hour = startHour; hour < endHour; hour++) {
              const slotStart = `${hour.toString().padStart(2, '0')}:00`;
              const slotEnd = `${(hour + 1).toString().padStart(2, '0')}:00`;

              events.push({
                id: `slot-${teacher.id}-${dateStr}-${hour}`,
                title: `${teacher.fullName.split(' ')[1] || teacher.fullName} - Available`,
                start: `${dateStr}T${slotStart}`,
                end: `${dateStr}T${slotEnd}`,
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                extendedProps: {
                  type: 'available',
                  teacherId: teacher.id,
                  teacherName: teacher.fullName,
                  teacherRate: teacher.hourlyRate,
                  subjects: teacher.subjects,
                  date: dateStr,
                  startTime: slotStart,
                  endTime: slotEnd
                }
              });
            }
          }
        });
      });
    }

    this.calendarEvents = events;
  }

  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onEventClicked(arg: EventClickArg): void {
    if (!this.currentUser) {
      this.notificationService.showWarning('Please login to book a class');
      return;
    }

    const props = arg.event.extendedProps;

    // If it's an existing booking, just show info
    if (props['type'] === 'booking') {
      if (props['studentId'] === this.currentUser.id) {
        this.notificationService.showInfo('You have already booked this class');
      } else {
        this.notificationService.showWarning('This slot is already taken');
      }
      return;
    }

    // If it's an available slot, open booking dialog
    if (props['type'] === 'available') {
      this.selectedSlot = props;
      this.showBookingDialog = true;

      // Pre-fill subject if teacher has subjects
      if (props['subjects'] && props['subjects'].length > 0) {
        this.bookingForm.subject = props['subjects'][0].name;
      }
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
      classType: this.bookingForm.classType,
      notes: this.bookingForm.notes
    };

    this.bookingService.createBooking(bookingRequest).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(response.message);
        this.closeBookingDialog();
        setTimeout(() => {
          this.router.navigate(['/my-bookings']);
        }, 1000);
      },
      error: () => {
        this.notificationService.showError('Failed to create booking');
      }
    });
  }

  closeBookingDialog(): void {
    this.showBookingDialog = false;
    this.selectedSlot = null;
    this.bookingForm = {
      subject: '',
      notes: '',
      classType: 'OneTime'
    };
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { ClassBookingService } from '../../core/services/class-booking.service';
import { TeacherService } from '../../core/services/teacher.service';
import { CalendarComponent } from '../shared/calendar/calendar.component';
import { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherAvailabilitySlot } from '../../core/models/shared.models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-manage-schedule',
  standalone: true,
  imports: [CommonModule, CalendarComponent, FormsModule],
  templateUrl: './manage-schedule.component.html',
  styleUrl: './manage-schedule.component.css'
})
export class ManageScheduleComponent implements OnInit {
  private bookingService = inject(ClassBookingService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private teacherService = inject(TeacherService);

  calendarEvents: EventInput[] = [];
  currentUser: any;
  availabilitySlots: TeacherAvailabilitySlot[] = [];

  // Availability Modal
  showAvailabilityModal = false;
  availabilityForm = {
    date: '',
    startTime: '09:00',
    endTime: '10:00'
  };

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSchedule();
  }

  public loadSchedule(): void {
    if (!this.currentUser) return;

    const startRange = new Date();
    const endRange = new Date();
    endRange.setDate(endRange.getDate() + 30);

    forkJoin({
      bookings: this.bookingService.getTeacherBookings(),
      slots: this.teacherService.getMyAvailabilitySlots(startRange, endRange)
    }).subscribe({
      next: ({ bookings, slots }) => {
        this.availabilitySlots = slots;
        const bookingEvents = this.buildBookingEvents(bookings);
        const slotEvents = this.mapAvailabilitySlotsToEvents(slots);

        const today = new Date();
        const pastDateEvent: EventInput = {
          id: 'past-dates-mask',
          start: '1970-01-01',
          end: today.toISOString().split('T')[0],
          display: 'background',
          backgroundColor: '#f5f5f5',
          classNames: ['past-date-mask']
        };

        this.calendarEvents = [...bookingEvents, ...slotEvents, pastDateEvent];
      },
      error: () => {
        this.notificationService.showError('Failed to load schedule');
      }
    });
  }

  private buildBookingEvents(bookings: any[]): EventInput[] {
    return bookings.map(b => ({
      id: b.id,
      title: `${b.subject || 'Class'} (${b.status})`,
      start: `${this.toDateString(b.date)}T${b.startTime}`,
      end: `${this.toDateString(b.date)}T${b.endTime}`,
      backgroundColor: b.status === 'Confirmed' ? '#ff9f89' : (b.status === 'Pending' ? '#ffc107' : '#3788d8'),
      borderColor: b.status === 'Confirmed' ? '#ff9f89' : (b.status === 'Pending' ? '#ffc107' : '#3788d8'),
      extendedProps: {
        status: b.status,
        type: 'booking'
      }
    }));
  }

  private mapAvailabilitySlotsToEvents(slots: TeacherAvailabilitySlot[]): EventInput[] {
    return slots.map(slot => {
      const status = slot.status || 'Available';
      const isAvailable = status === 'Available';
      const color = isAvailable ? '#c6f6d5' : (status === 'Pending' ? '#ffeeba' : '#a0aec0');

      return {
        id: `slot-${slot.id}`,
        title: isAvailable ? 'Available' : status,
        start: `${this.toDateString(slot.date)}T${slot.startTime}`,
        end: `${this.toDateString(slot.date)}T${slot.endTime}`,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          type: 'slot',
          slotId: slot.id,
          status: slot.status
        }
      };
    });
  }

  onSlotSelected(arg: DateSelectArg): void {
    if (!this.currentUser) return;

    const selectedDate = new Date(arg.start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      this.notificationService.showError('Cannot add availability for past dates');
      return;
    }

    this.availabilityForm.date = this.toDateString(selectedDate);
    this.availabilityForm.startTime = arg.startStr.split('T')[1]?.substring(0, 5) || '09:00';

    const end = new Date(selectedDate.getTime() + 60 * 60 * 1000);
    this.availabilityForm.endTime = end.toTimeString().substring(0, 5);

    this.showAvailabilityModal = true;
  }

  closeAvailabilityModal(): void {
    this.showAvailabilityModal = false;
    this.availabilityForm = { date: '', startTime: '09:00', endTime: '10:00' };
  }

  saveAvailability(): void {
    if (!this.availabilityForm.date) {
      this.notificationService.showWarning('Pick a date on the calendar first');
      return;
    }

    const slotDate = new Date(this.availabilityForm.date);
    const duplicate = this.availabilitySlots.some(slot =>
      this.toDateString(slot.date) === this.availabilityForm.date &&
      slot.startTime === this.availabilityForm.startTime &&
      slot.endTime === this.availabilityForm.endTime
    );

    if (duplicate) {
      this.notificationService.showWarning('Slot already exists');
      return;
    }

    this.teacherService.addAvailabilitySlot({
      date: slotDate,
      startTime: this.availabilityForm.startTime,
      endTime: this.availabilityForm.endTime
    }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Availability added successfully');
        this.closeAvailabilityModal();
        this.loadSchedule();
      },
      error: () => this.notificationService.showError('Failed to add availability')
    });
  }

  onEventClicked(arg: EventClickArg): void {
    const eventProps = arg.event.extendedProps;

    if (eventProps['type'] === 'slot') {
      if (eventProps['status'] && eventProps['status'] !== 'Available') {
        this.notificationService.showWarning('This slot is locked by a booking');
        return;
      }

      if (confirm('Remove this availability slot?')) {
        const slotId = eventProps['slotId'] as string;
        this.teacherService.deleteAvailabilitySlot(slotId).subscribe({
          next: () => {
            this.notificationService.showSuccess('Availability removed');
            this.loadSchedule();
          },
          error: () => this.notificationService.showError('Failed to remove availability')
        });
      }
      return;
    }

    if (eventProps['type'] === 'booking') {
      if (eventProps['status'] === 'Pending') {
        const approve = confirm('Approve this booking request? Press Cancel to reject.');
        if (approve) {
          this.bookingService.confirmBooking(arg.event.id).subscribe({
            next: () => {
              this.notificationService.showSuccess('Booking approved');
              this.loadSchedule();
            },
            error: () => this.notificationService.showError('Failed to approve booking')
          });
          return;
        }

        const reject = confirm('Reject this booking request?');
        if (reject) {
          this.bookingService.rejectBooking(arg.event.id, 'Rejected by teacher').subscribe({
            next: () => {
              this.notificationService.showSuccess('Booking rejected');
              this.loadSchedule();
            },
            error: () => this.notificationService.showError('Failed to reject booking')
          });
        }
        return;
      }

      if (eventProps['status'] === 'Confirmed') {
        if (confirm('Cancel this confirmed booking?')) {
          this.bookingService.cancelBooking(arg.event.id, 'Cancelled by teacher').subscribe({
            next: () => {
              this.notificationService.showSuccess('Booking cancelled');
              this.loadSchedule();
            },
            error: () => {
              this.notificationService.showError('Failed to cancel booking');
            }
          });
        }
      }
    }
  }

  private toDateString(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

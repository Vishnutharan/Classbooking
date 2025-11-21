import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { ClassBookingService } from '../../services/class-booking.service';
import { CalendarComponent } from '../shared/calendar/calendar.component';
import { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-schedule',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './manage-schedule.component.html',
  styleUrl: './manage-schedule.component.css'
})
export class ManageScheduleComponent implements OnInit {
  private bookingService = inject(ClassBookingService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  calendarEvents: EventInput[] = [];
  currentUser: any;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSchedule();
  }

  public loadSchedule(): void {
    if (!this.currentUser) return;

    this.bookingService.getTeacherBookings().subscribe({
      next: (bookings) => {
        this.calendarEvents = bookings.map(b => ({
          id: b.id,
          title: b.subject || 'Class',
          start: `${b.date}T${b.startTime}`,
          end: `${b.date}T${b.endTime}`,
          backgroundColor: b.status === 'Confirmed' ? '#ff9f89' : (b.status === 'Pending' ? '#ffc107' : '#3788d8'),
          borderColor: b.status === 'Confirmed' ? '#ff9f89' : (b.status === 'Pending' ? '#ffc107' : '#3788d8'),
          extendedProps: {
            status: b.status
          }
        }));
      },
      error: () => {
        this.notificationService.showError('Failed to load schedule');
      }
    });
  }

  onSlotSelected(arg: DateSelectArg): void {
    if (!this.currentUser) return;

    // For demo purposes, we'll just show a message
    // In a real app, this would create a booking or availability slot
    this.notificationService.showInfo('Slot selection functionality - would create availability here');
  }

  onEventClicked(arg: EventClickArg): void {
    const eventId = arg.event.id;
    const eventProps = arg.event.extendedProps;

    if (eventProps['status'] === 'Confirmed') {
      this.notificationService.showWarning('Cannot delete a confirmed booking');
      return;
    }

    if (confirm('Cancel this booking?')) {
      this.bookingService.cancelBooking(eventId, 'Cancelled by teacher').subscribe({
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

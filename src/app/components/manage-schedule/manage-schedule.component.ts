import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { ClassBookingService } from '../../core/services/class-booking.service';
import { TeacherService } from '../../core/services/teacher.service';
import { CalendarComponent } from '../shared/calendar/calendar.component';
import { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  // Availability Modal
  showAvailabilityModal = false;
  availabilityForm = {
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '17:00'
  };
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSchedule();
  }

  public loadSchedule(): void {
    if (!this.currentUser) return;

    // Load Bookings
    this.bookingService.getTeacherBookings().subscribe({
      next: (bookings) => {
        const bookingEvents = bookings.map(b => ({
          id: b.id,
          title: b.subject || 'Class',
          start: `${b.date}T${b.startTime}`,
          end: `${b.date}T${b.endTime}`,
          backgroundColor: b.status === 'Confirmed' ? '#ff9f89' : (b.status === 'Pending' ? '#ffc107' : '#3788d8'),
          borderColor: b.status === 'Confirmed' ? '#ff9f89' : (b.status === 'Pending' ? '#ffc107' : '#3788d8'),
          extendedProps: {
            status: b.status,
            type: 'booking'
          }
        }));

        // Load Availability
        this.teacherService.getMyProfile().subscribe({
          next: (profile) => {
            const availabilityEvents = this.mapAvailabilityToEvents(profile.availability);

            // Add past date masking
            const today = new Date();
            const pastDateEvent: EventInput = {
              id: 'past-dates-mask',
              start: '1970-01-01',
              end: today.toISOString().split('T')[0], // Up to today
              display: 'background',
              backgroundColor: '#f0f0f0', // Light grey for past
              classNames: ['past-date-mask']
            };

            this.calendarEvents = [...bookingEvents, ...availabilityEvents, pastDateEvent];
          },
          error: () => {
            this.notificationService.showError('Failed to load profile');
            this.calendarEvents = bookingEvents; // Show bookings at least
          }
        });
      },
      error: () => {
        this.notificationService.showError('Failed to load schedule');
      }
    });
  }

  private mapAvailabilityToEvents(availability: any[]): EventInput[] {
    // Availability is generic (e.g., "Monday 09:00-17:00"). 
    // We use FullCalendar's recurring events (daysOfWeek) to show this across all weeks.
    const events: EventInput[] = [];

    const dayMap: { [key: string]: number } = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };

    availability.forEach((slot, index) => {
      const dayOfWeek = dayMap[slot.dayOfWeek];
      if (dayOfWeek !== undefined) {
        events.push({
          id: `avail-${index}`,
          title: 'Available',
          startTime: slot.startTime, // 'HH:mm'
          endTime: slot.endTime,     // 'HH:mm'
          daysOfWeek: [dayOfWeek],   // Recurring on this day
          display: 'background',
          backgroundColor: '#c6f6d5',
          extendedProps: {
            type: 'availability'
          }
        });
      }
    });

    return events;
  }

  onSlotSelected(arg: DateSelectArg): void {
    if (!this.currentUser) return;

    // Validation: Cannot select past dates
    const selectedDate = new Date(arg.start);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for date comparison

    if (selectedDate < today) {
      this.notificationService.showError('Cannot add availability for past dates');
      return;
    }

    // Pre-fill form based on selection
    const date = arg.start;
    const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday

    const mapDay = (day: number) => {
      if (day === 0) return 'Sunday';
      return this.daysOfWeek[day - 1];
    };

    this.availabilityForm.dayOfWeek = mapDay(dayIndex);
    this.availabilityForm.startTime = arg.startStr.split('T')[1]?.substring(0, 5) || '09:00';

    // Default end time to start + 1 hour
    const end = new Date(date.getTime() + 60 * 60 * 1000);
    this.availabilityForm.endTime = end.toTimeString().substring(0, 5);

    this.showAvailabilityModal = true;
  }

  closeAvailabilityModal(): void {
    this.showAvailabilityModal = false;
  }

  saveAvailability(): void {
    this.teacherService.getMyProfile().subscribe({
      next: (teacher) => {
        const newAvailability = {
          dayOfWeek: this.availabilityForm.dayOfWeek,
          startTime: this.availabilityForm.startTime,
          endTime: this.availabilityForm.endTime
        };

        const updatedAvailability = [...teacher.availability, newAvailability];

        this.teacherService.updateAvailability(updatedAvailability).subscribe({
          next: () => {
            this.notificationService.showSuccess('Availability added successfully');
            this.closeAvailabilityModal();
            this.loadSchedule(); // Refresh calendar
          },
          error: () => {
            this.notificationService.showError('Failed to update availability');
          }
        });
      },
      error: () => {
        this.notificationService.showError('Failed to fetch profile');
      }
    });
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

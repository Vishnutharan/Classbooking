import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { DemoDataService, ClassSession } from '../../services/demo-data.service';
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
  private demoDataService = inject(DemoDataService);
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

    const allClasses = this.demoDataService.getClasses();
    // Filter classes for this teacher
    const myClasses = allClasses.filter(c => c.teacherId === this.currentUser.id);

    this.calendarEvents = myClasses.map(c => ({
      id: c.id,
      title: c.title || 'Available Slot',
      start: c.start,
      end: c.end,
      backgroundColor: c.status === 'booked' ? '#ff9f89' : '#3788d8',
      borderColor: c.status === 'booked' ? '#ff9f89' : '#3788d8',
      extendedProps: {
        status: c.status
      }
    }));
  }

  onSlotSelected(arg: DateSelectArg): void {
    if (!this.currentUser) return;

    const newClass: ClassSession = {
      id: `slot-${Date.now()}`,
      title: 'Available Slot',
      teacherId: this.currentUser.id,
      start: arg.startStr,
      end: arg.endStr,
      status: 'available'
    };

    this.demoDataService.addClass(newClass);
    this.notificationService.showSuccess('Availability slot added');
    this.loadSchedule();
  }

  onEventClicked(arg: EventClickArg): void {
    const eventId = arg.event.id;
    const eventProps = arg.event.extendedProps;

    if (eventProps['status'] === 'booked') {
      this.notificationService.showWarning('Cannot delete a booked slot');
      return;
    }

    if (confirm('Delete this availability slot?')) {
      this.demoDataService.deleteClass(eventId);
      this.notificationService.showSuccess('Slot removed');
      this.loadSchedule();
    }
  }
}


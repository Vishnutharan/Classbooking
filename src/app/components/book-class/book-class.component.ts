import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { DemoDataService } from '../../services/demo-data.service';
import { CalendarComponent } from '../shared/calendar/calendar.component';
import { EventInput, EventClickArg } from '@fullcalendar/core';


@Component({
  selector: 'app-book-class',
  imports: [CommonModule, CalendarComponent],
  templateUrl: './book-class.component.html',
  styleUrl: './book-class.component.css'
})
export class BookClassComponent implements OnInit {
  private demoDataService = inject(DemoDataService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  calendarEvents: EventInput[] = [];
  currentUser: any;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadAvailableClasses();
  }

  public loadAvailableClasses(): void {
    const allClasses = this.demoDataService.getClasses();
    // Show all available classes, or booked classes if they belong to this student
    const relevantClasses = allClasses.filter(c =>
      c.status === 'available' || (c.status === 'booked' && c.studentId === this.currentUser?.id)
    );

    this.calendarEvents = relevantClasses.map(c => ({
      id: c.id,
      title: c.status === 'available' ? `Available: ${c.title}` : `Booked: ${c.title}`,
      start: c.start,
      end: c.end,
      backgroundColor: c.status === 'available' ? '#28a745' : '#6c757d',
      borderColor: c.status === 'available' ? '#28a745' : '#6c757d',
      extendedProps: {
        status: c.status,
        teacherId: c.teacherId,
        studentId: c.studentId
      }
    }));
  }

  onEventClicked(arg: EventClickArg): void {
    if (!this.currentUser) {
      this.notificationService.showWarning('Please login to book a class');
      return;
    }

    const eventId = arg.event.id;
    const props = arg.event.extendedProps;

    if (props['status'] === 'booked') {
      if (props['studentId'] === this.currentUser.id) {
        this.notificationService.showInfo('You have already booked this class');
      } else {
        this.notificationService.showWarning('This slot is already taken');
      }
      return;
    }

    if (confirm('Do you want to book this class?')) {
      const allClasses = this.demoDataService.getClasses();
      const classIndex = allClasses.findIndex(c => c.id === eventId);

      if (classIndex !== -1) {
        const classSession = allClasses[classIndex];
        classSession.status = 'booked';
        classSession.studentId = this.currentUser.id;

        this.demoDataService.updateClass(classSession);
        this.notificationService.showSuccess('Class booked successfully!');
        this.loadAvailableClasses();

        // Redirect to my bookings after a short delay
        setTimeout(() => {
          this.router.navigate(['/my-bookings']);
        }, 1500);
      }
    }
  }
}

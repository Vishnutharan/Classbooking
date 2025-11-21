import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ClassBookingService } from '../../services/class-booking.service';
import { ClassBooking } from '../../models/shared.models';

@Component({
  selector: 'app-my-classes',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-classes.component.html',
  styleUrl: './my-classes.component.css'
})
export class MyClassesComponent implements OnInit {
  private bookingService = inject(ClassBookingService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  allClasses: ClassBooking[] = [];
  filteredClasses: ClassBooking[] = [];
  isLoading = false;
  viewMode: 'list' | 'calendar' = 'list';
  statusFilter = 'All';
  statuses = ['All', 'Upcoming', 'Completed', 'Cancelled'];
  currentUser: any;

  showNotesModal = false;
  selectedClass: ClassBooking | null = null;
  classNotes = '';
  uploadedResources: any[] = [];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadClasses();
  }

  private loadClasses(): void {
    if (!this.currentUser) return;

    this.isLoading = true;

    // Get bookings based on user role
    const bookingsObservable = this.currentUser.role === 'Teacher'
      ? this.bookingService.getTeacherBookings()
      : this.bookingService.getStudentBookings();

    bookingsObservable.subscribe({
      next: (bookings) => {
        this.allClasses = bookings;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load classes');
        this.isLoading = false;
      }
    });
  }

  private applyFilter(): void {
    let filtered = this.allClasses;

    if (this.statusFilter !== 'All') {
      const statusMap: Record<string, string> = {
        'Upcoming': 'Confirmed',
        'Completed': 'Completed',
        'Cancelled': 'Cancelled'
      };
      const mappedStatus = statusMap[this.statusFilter];
      if (mappedStatus) {
        filtered = filtered.filter(c => c.status === mappedStatus);
      }
    }

    this.filteredClasses = filtered.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  getClassStatus(booking: ClassBooking): string {
    const statusMap: Record<string, string> = {
      'Confirmed': 'Upcoming',
      'Completed': 'Completed',
      'Cancelled': 'Cancelled',
      'Pending': 'Upcoming'
    };
    return statusMap[booking.status] || booking.status;
  }

  startClass(booking: ClassBooking): void {
    this.notificationService.showInfo(`Starting class: ${booking.subject}`);
    window.open(booking.meetingLink || 'https://meet.google.com', '_blank');
  }

  markComplete(booking: ClassBooking): void {
    if (confirm('Mark this class as completed?')) {
      this.bookingService.completeBooking(booking.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Class marked as completed');
          this.loadClasses();
        },
        error: () => {
          this.notificationService.showError('Failed to mark class as completed');
        }
      });
    }
  }

  cancelClass(booking: ClassBooking): void {
    if (confirm('Are you sure you want to cancel this class?')) {
      this.bookingService.cancelBooking(booking.id, 'Cancelled by user').subscribe({
        next: () => {
          this.notificationService.showSuccess('Class cancelled');
          this.loadClasses();
        },
        error: () => {
          this.notificationService.showError('Failed to cancel class');
        }
      });
    }
  }

  rescheduleClass(booking: ClassBooking): void {
    this.notificationService.showInfo('Reschedule functionality coming soon');
  }

  openNotesModal(booking: ClassBooking): void {
    this.selectedClass = booking;
    this.classNotes = booking.notes || '';
    this.showNotesModal = true;
  }

  closeNotesModal(): void {
    this.showNotesModal = false;
    this.selectedClass = null;
  }

  saveNotes(): void {
    if (this.selectedClass) {
      const updatedBooking = { ...this.selectedClass, notes: this.classNotes };
      this.bookingService.updateBooking(this.selectedClass.id, updatedBooking).subscribe({
        next: () => {
          this.notificationService.showSuccess('Notes saved successfully');
          this.closeNotesModal();
          this.loadClasses();
        },
        error: () => {
          this.notificationService.showError('Failed to save notes');
        }
      });
    }
  }

  onResourceUpload(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      Array.from(files).forEach((file: any) => {
        this.uploadedResources.push({
          name: file.name,
          size: (file.size / 1024).toFixed(2),
          uploadedAt: new Date()
        });
      });
      this.notificationService.showSuccess('Resources uploaded successfully');
    }
  }

  removeResource(index: number): void {
    this.uploadedResources.splice(index, 1);
    this.notificationService.showSuccess('Resource removed');
  }

  getClassDuration(booking: ClassBooking): number {
    const [startHour, startMin] = booking.startTime.split(':').map(Number);
    const [endHour, endMin] = booking.endTime.split(':').map(Number);
    return (endHour - startHour) * 60 + (endMin - startMin);
  }
}

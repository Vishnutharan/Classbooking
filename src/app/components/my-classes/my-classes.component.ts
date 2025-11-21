import { Component, inject, OnInit } from '@angular/core';
import { ClassBooking, ClassBookingService } from '../../services/class-booking.service';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-classes',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-classes.component.html',
  styleUrl: './my-classes.component.css'
})
export class MyClassesComponent implements OnInit {
  private bookingService = inject(ClassBookingService);
  private notificationService = inject(NotificationService);

  allClasses: ClassBooking[] = [];
  filteredClasses: ClassBooking[] = [];
  isLoading = false;
  viewMode: 'list' | 'calendar' = 'list';
  statusFilter = 'All';
  statuses = ['All', 'Upcoming', 'Completed', 'Cancelled'];

  showNotesModal = false;
  selectedClass: ClassBooking | null = null;
  classNotes = '';
  uploadedResources: any[] = [];

  ngOnInit(): void {
    this.loadClasses();
  }

  private loadClasses(): void {
    this.isLoading = true;
    this.bookingService.getTeacherBookings().subscribe({
      next: (classes) => {
        this.allClasses = classes;
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
      filtered = filtered.filter(c => this.getClassStatus(c) === this.statusFilter);
    }

    this.filteredClasses = filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  getClassStatus(booking: ClassBooking): string {
    const classDate = new Date(booking.date);
    const now = new Date();
    
    if (booking.status === 'Completed') return 'Completed';
    if (booking.status === 'Cancelled') return 'Cancelled';
    if (classDate < now) return 'Completed';
    return 'Upcoming';
  }

  startClass(booking: ClassBooking): void {
    this.notificationService.showInfo(`Starting class: ${booking.subject}`);
  }

  markComplete(booking: ClassBooking): void {
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

  cancelClass(booking: ClassBooking): void {
    this.bookingService.cancelBooking(booking.id, 'Teacher cancelled').subscribe({
      next: () => {
        this.notificationService.showSuccess('Class cancelled');
        this.loadClasses();
      },
      error: () => {
        this.notificationService.showError('Failed to cancel class');
      }
    });
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
      this.notificationService.showSuccess('Notes saved successfully');
      this.closeNotesModal();
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

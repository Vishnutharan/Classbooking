import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DemoDataService } from '../../services/demo-data.service';

@Component({
  selector: 'app-my-classes',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-classes.component.html',
  styleUrl: './my-classes.component.css'
})
export class MyClassesComponent implements OnInit {
  private demoDataService = inject(DemoDataService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  allClasses: any[] = [];
  filteredClasses: any[] = [];
  isLoading = false;
  viewMode: 'list' | 'calendar' = 'list';
  statusFilter = 'All';
  statuses = ['All', 'Upcoming', 'Completed', 'Cancelled'];
  currentUser: any;

  showNotesModal = false;
  selectedClass: any | null = null;
  classNotes = '';
  uploadedResources: any[] = [];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadClasses();
  }

  private loadClasses(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    const allClasses = this.demoDataService.getClasses();

    // Filter for classes where the current user is the teacher
    // And show all slots that are booked (or maybe even available ones if we want to show schedule)
    // For "My Classes", usually we show booked sessions.
    const myClasses = allClasses.filter(c =>
      c.teacherId === this.currentUser.id && c.status !== 'available'
    );

    this.allClasses = myClasses.map(c => ({
      id: c.id,
      subject: c.title,
      studentId: c.studentId || 'Unknown',
      date: c.start,
      startTime: c.start.split('T')[1].substring(0, 5),
      endTime: c.end.split('T')[1].substring(0, 5),
      status: c.status === 'booked' ? 'Upcoming' : (c.status === 'completed' ? 'Completed' : 'Cancelled'),
      classType: 'OneTime', // Simplified
      notes: c.description
    }));

    this.applyFilter();
    this.isLoading = false;
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

  getClassStatus(booking: any): string {
    return booking.status;
  }

  startClass(booking: any): void {
    this.notificationService.showInfo(`Starting class: ${booking.subject}`);
    window.open(booking.meetingLink || 'https://meet.google.com', '_blank');
  }

  markComplete(booking: any): void {
    if (confirm('Mark this class as completed?')) {
      const allClasses = this.demoDataService.getClasses();
      const session = allClasses.find(c => c.id === booking.id);

      if (session) {
        session.status = 'completed';
        this.demoDataService.updateClass(session);
        this.notificationService.showSuccess('Class marked as completed');
        this.loadClasses();
      }
    }
  }

  cancelClass(booking: any): void {
    if (confirm('Are you sure you want to cancel this class?')) {
      const allClasses = this.demoDataService.getClasses();
      const session = allClasses.find(c => c.id === booking.id);

      if (session) {
        session.status = 'cancelled'; // Or 'available' if we want to free up the slot
        // For now, let's just mark as cancelled so history is kept
        this.demoDataService.updateClass(session);
        this.notificationService.showSuccess('Class cancelled');
        this.loadClasses();
      }
    }
  }

  rescheduleClass(booking: any): void {
    this.notificationService.showInfo('Reschedule functionality coming soon');
  }

  openNotesModal(booking: any): void {
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
      const allClasses = this.demoDataService.getClasses();
      const session = allClasses.find(c => c.id === this.selectedClass.id);

      if (session) {
        session.description = this.classNotes;
        this.demoDataService.updateClass(session);
        this.notificationService.showSuccess('Notes saved successfully');
        this.closeNotesModal();
        this.loadClasses();
      }
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

  getClassDuration(booking: any): number {
    const [startHour, startMin] = booking.startTime.split(':').map(Number);
    const [endHour, endMin] = booking.endTime.split(':').map(Number);
    return (endHour - startHour) * 60 + (endMin - startMin);
  }
}

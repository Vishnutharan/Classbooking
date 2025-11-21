import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { DemoDataService } from '../../services/demo-data.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent implements OnInit {
  private demoDataService = inject(DemoDataService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  allBookings: any[] = [];
  filteredBookings: any[] = [];
  isLoading = false;
  viewMode: 'table' | 'card' = 'card';
  statusFilter = 'All';
  sortBy = 'date';
  currentUser: any;

  statuses = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadBookings();
  }

  private loadBookings(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    const allClasses = this.demoDataService.getClasses();

    // Filter for bookings where the current user is the student
    const myBookings = allClasses.filter(c => c.studentId === this.currentUser.id);

    // Map to a display-friendly format
    this.allBookings = myBookings.map(c => ({
      id: c.id,
      subject: c.title,
      teacherName: 'Teacher', // In a real app, we'd look up the teacher name
      date: c.start,
      startTime: c.start.split('T')[1].substring(0, 5),
      duration: 60, // Simplified
      status: c.status === 'booked' ? 'Confirmed' : c.status,
      amount: 1000 // Simplified
    }));

    this.applyFiltersAndSort();
    this.isLoading = false;
  }

  private applyFiltersAndSort(): void {
    let filtered = this.allBookings;

    if (this.statusFilter !== 'All') {
      filtered = filtered.filter(b => b.status === this.statusFilter);
    }

    switch (this.sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'subject':
        filtered.sort((a, b) => a.subject.localeCompare(b.subject));
        break;
    }

    this.filteredBookings = filtered;
    this.calculatePagination();
    this.currentPage = 1;
  }

  private calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredBookings.length / this.itemsPerPage);
  }

  getDisplayedBookings(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBookings.slice(start, start + this.itemsPerPage);
  }

  onFilterChange(): void {
    this.applyFiltersAndSort();
  }

  onSortChange(): void {
    this.applyFiltersAndSort();
  }

  // Modal states
  showCancelModal = false;
  showRescheduleModal = false;
  showReviewModal = false;
  selectedBooking: any | null = null;

  // Modal data
  cancelReason = '';
  rescheduleDate = '';
  rescheduleTime = '';
  availableSlots: string[] = [];
  ratingValue = 0;
  reviewText = '';

  openCancelModal(booking: any): void {
    this.selectedBooking = booking;
    this.cancelReason = '';
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.selectedBooking = null;
  }

  confirmCancel(): void {
    if (!this.selectedBooking) return;

    const allClasses = this.demoDataService.getClasses();
    const session = allClasses.find(c => c.id === this.selectedBooking.id);

    if (session) {
      session.status = 'available';
      session.studentId = undefined;
      this.demoDataService.updateClass(session);
      this.notificationService.showSuccess('Booking cancelled');
      this.loadBookings();
      this.closeCancelModal();
    }
  }

  openRescheduleModal(booking: any): void {
    this.selectedBooking = booking;
    this.rescheduleDate = '';
    this.rescheduleTime = '';
    this.availableSlots = [];
    this.showRescheduleModal = true;
  }

  closeRescheduleModal(): void {
    this.showRescheduleModal = false;
    this.selectedBooking = null;
  }

  onRescheduleDate(): void {
    // Mock available slots for demo
    this.availableSlots = ['09:00', '10:00', '14:00', '16:00'];
  }

  confirmReschedule(): void {
    this.notificationService.showInfo('Reschedule functionality simulated');
    this.closeRescheduleModal();
  }

  openReviewModal(booking: any): void {
    this.selectedBooking = booking;
    this.ratingValue = 0;
    this.reviewText = '';
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.selectedBooking = null;
  }

  setRating(value: number): void {
    this.ratingValue = value;
  }

  submitReview(): void {
    this.notificationService.showSuccess('Review submitted');
    this.closeReviewModal();
  }

  cancelBooking(booking: any): void {
    this.openCancelModal(booking);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}

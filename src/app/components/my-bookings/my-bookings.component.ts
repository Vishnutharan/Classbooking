import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { ClassBookingService } from '../../services/class-booking.service';
import { ClassBooking } from '../../models/shared.models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(ClassBookingService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  allBookings: ClassBooking[] = [];
  filteredBookings: ClassBooking[] = [];
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

    this.bookingService.getStudentBookings().subscribe({
      next: (bookings) => {
        this.allBookings = bookings;
        this.applyFiltersAndSort();
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load bookings');
        this.isLoading = false;
      }
    });
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

  getDisplayedBookings(): ClassBooking[] {
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
  selectedBooking: ClassBooking | null = null;

  // Modal data
  cancelReason = '';
  rescheduleDate = '';
  rescheduleTime = '';
  availableSlots: string[] = [];
  ratingValue = 0;
  reviewText = '';

  openCancelModal(booking: ClassBooking): void {
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

    this.bookingService.cancelBooking(this.selectedBooking.id, this.cancelReason || 'Cancelled by student').subscribe({
      next: () => {
        this.notificationService.showSuccess('Booking cancelled');
        this.loadBookings();
        this.closeCancelModal();
      },
      error: () => {
        this.notificationService.showError('Failed to cancel booking');
      }
    });
  }

  openRescheduleModal(booking: ClassBooking): void {
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

  openReviewModal(booking: ClassBooking): void {
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

  cancelBooking(booking: ClassBooking): void {
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

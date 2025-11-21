import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClassBooking, ClassBookingService } from '../../services/class-booking.service';
import { NotificationService } from '../../services/notification.service';

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


  allBookings: ClassBooking[] = [];
  filteredBookings: ClassBooking[] = [];
  isLoading = false;
  viewMode: 'table' | 'card' = 'card';
  statusFilter = 'All';
  sortBy = 'date';

  statuses = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

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

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  ngOnInit(): void {
    this.loadBookings();
  }

  private loadBookings(): void {
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
      case 'teacher':
        filtered.sort((a, b) => a.teacherId.localeCompare(b.teacherId));
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
    if (!this.selectedBooking || !this.cancelReason.trim()) {
      this.notificationService.showWarning('Please provide a reason for cancellation');
      return;
    }

    this.bookingService.cancelBooking(this.selectedBooking.id, this.cancelReason).subscribe({
      next: () => {
        this.notificationService.showSuccess('Booking cancelled successfully');
        this.loadBookings();
        this.closeCancelModal();
      },
      error: (error) => {
        this.notificationService.showError(error.message || 'Failed to cancel booking');
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
    if (this.selectedBooking && this.rescheduleDate) {
      this.bookingService.getAvailableSlots(this.selectedBooking.teacherId, new Date(this.rescheduleDate))
        .subscribe({
          next: (slots) => {
            this.availableSlots = slots;
          }
        });
    }
  }

  confirmReschedule(): void {
    if (!this.selectedBooking || !this.rescheduleDate || !this.rescheduleTime) {
      this.notificationService.showWarning('Please select date and time');
      return;
    }

    const [hours, minutes] = this.rescheduleTime.split(':');
    const endHours = parseInt(hours) + 1;
    const endTime = `${String(endHours).padStart(2, '0')}:${minutes}`;

    this.bookingService.rescheduleBooking(
      this.selectedBooking.id,
      new Date(this.rescheduleDate),
      this.rescheduleTime,
      endTime
    ).subscribe({
      next: () => {
        this.notificationService.showSuccess('Booking rescheduled successfully');
        this.loadBookings();
        this.closeRescheduleModal();
      },
      error: (error) => {
        this.notificationService.showError(error.message || 'Failed to reschedule');
      }
    });
  }

  openReviewModal(booking: ClassBooking): void {
    if (booking.status !== 'Completed') {
      this.notificationService.showWarning('Can only review completed classes');
      return;
    }
    this.selectedBooking = booking;
    this.ratingValue = 0;
    this.reviewText = '';
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.selectedBooking = null;
  }

  submitReview(): void {
    if (!this.selectedBooking || this.ratingValue === 0 || !this.reviewText.trim()) {
      this.notificationService.showWarning('Please provide a rating and review');
      return;
    }

    // This would call a teacher service method to submit review
    this.notificationService.showSuccess('Review submitted successfully');
    this.closeReviewModal();
    this.loadBookings();
  }

  setRating(value: number): void {
    this.ratingValue = value;
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

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../Service/teacher.service';
import { NotificationService } from '../../Service/notification.service';

interface Review {
  id: string;
  studentName: string;
  studentPicture?: string;
  rating: number;
  text: string;
  date: Date;
  helpful: number;
  reply?: string;
}

@Component({
  selector: 'app-reviews-ratings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews-ratings.component.html',
  styleUrl: './reviews-ratings.component.css'
})
export class ReviewsRatingsComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private notificationService = inject(NotificationService);

  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  isLoading = false;
  averageRating = 0;
  totalReviews = 0;

  // Use index signature so [rating] in template is type-safe
  ratingDistribution: { [key: number]: number } = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  selectedRatingFilter = 0;
  replyingToReviewId: string | null = null;
  replyText = '';
  teacherId = '';

  ngOnInit(): void {
    this.loadReviews();
  }

  private loadReviews(): void {
    this.isLoading = true;
    this.teacherService.getMyProfile().subscribe({
      next: (profile) => {
        this.teacherId = profile.id;
        this.averageRating = profile.averageRating;
        this.loadTeacherReviews(profile.id);
      },
      error: () => {
        this.notificationService.showError('Failed to load profile');
        this.isLoading = false;
      }
    });
  }

  private loadTeacherReviews(teacherId: string): void {
    this.teacherService.getTeacherReviews(teacherId).subscribe({
      next: (reviews: any) => {
        this.reviews = reviews.map((r: any) => ({
          id: r.id || Date.now().toString(),
          studentName: r.studentName,
          studentPicture: r.studentPicture,
          rating: r.rating,
          text: r.text,
          date: new Date(r.date),
          helpful: r.helpful || 0,
          reply: r.reply
        }));

        this.totalReviews = this.reviews.length;
        this.calculateRatingDistribution();
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load reviews');
        this.isLoading = false;
      }
    });
  }

  private calculateRatingDistribution(): void {
    this.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    this.reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        this.ratingDistribution[review.rating] =
          (this.ratingDistribution[review.rating] || 0) + 1;
      }
    });
  }

  onRatingFilterChange(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.selectedRatingFilter === 0) {
      this.filteredReviews = [...this.reviews];
    } else {
      this.filteredReviews = this.reviews.filter(
        r => r.rating === this.selectedRatingFilter
      );
    }

    this.filteredReviews.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  getRatingPercentage(rating: number): number {
    if (this.totalReviews === 0) return 0;
    const count = this.ratingDistribution[rating] || 0;
    return Math.round((count / this.totalReviews) * 100);
  }

  getRatingCount(rating: number): number {
    return this.ratingDistribution[rating] || 0;
  }

  markHelpful(reviewId: string): void {
    const review = this.reviews.find(r => r.id === reviewId);
    if (review) {
      review.helpful++;
      this.notificationService.showSuccess('Marked as helpful');
    }
  }

  openReplyForm(reviewId: string): void {
    this.replyingToReviewId = reviewId;
    this.replyText = '';
  }

  closeReplyForm(): void {
    this.replyingToReviewId = null;
    this.replyText = '';
  }

  submitReply(): void {
    if (!this.replyText.trim() || !this.replyingToReviewId) {
      this.notificationService.showWarning('Please enter a reply');
      return;
    }

    const review = this.reviews.find(r => r.id === this.replyingToReviewId);
    if (review) {
      review.reply = this.replyText;
      this.notificationService.showSuccess('Reply posted successfully');
      this.closeReplyForm();
    }
  }

  getStarArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }
}

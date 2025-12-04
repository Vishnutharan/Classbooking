import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../core/services/teacher.service';
import { StudentService } from '../../core/services/student.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

interface Review {
  id: string;
  studentName: string;
  studentPicture?: string;
  teacherName?: string;
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
  private studentService = inject(StudentService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  isLoading = false;
  averageRating = 0;
  totalReviews = 0;
  currentUserRole = '';
  isStudentView = false;

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
  editingReviewId: string | null = null;
  editRating = 0;
  editComment = '';

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserRole = user?.role || '';
    this.isStudentView = this.currentUserRole === 'Student';
    this.loadReviews();
  }

  private loadReviews(): void {
    this.isLoading = true;
    
    if (this.currentUserRole === 'Teacher') {
      this.loadTeacherReviews();
    } else if (this.currentUserRole === 'Student') {
      this.loadStudentReviews();
    } else {
      this.notificationService.showError('Invalid user role');
      this.isLoading = false;
    }
  }

  private loadTeacherReviews(): void {
    this.teacherService.getMyProfile().subscribe({
      next: (profile) => {
        this.teacherId = profile.id;
        this.averageRating = profile.averageRating;
        this.loadTeacherReviewsList(profile.id);
      },
      error: () => {
        this.notificationService.showError('Failed to load profile');
        this.isLoading = false;
      }
    });
  }
  
  private loadStudentReviews(): void {
    this.studentService.getMyReviews().subscribe({
      next: (reviews: any[]) => {
        this.reviews = reviews.map((r: any) => ({
          id: r.id || Date.now().toString(),
          studentName: 'You', // Student's own review
          teacherName: r.teacherName,
          rating: r.rating,
          text: r.comment || r.text || '',
          date: new Date(r.createdAt || r.date),
          helpful: 0,
          reply: r.teacherReply
        }));

        this.recomputeStats();
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load your reviews');
        this.isLoading = false;
      }
    });
  }

  private loadTeacherReviewsList(teacherId: string): void {
    this.teacherService.getTeacherReviews(teacherId).subscribe({
      next: (reviews: any) => {
        this.reviews = reviews.map((r: any) => ({
          id: r.id || Date.now().toString(),
          studentName: r.studentName,
          studentPicture: r.studentPicture,
          rating: r.rating,
          text: r.comment || r.text || '',
          date: new Date(r.createdAt || r.date),
          helpful: r.helpful || 0,
          reply: r.reply
        }));

        this.recomputeStats();
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

  private recomputeStats(): void {
    this.totalReviews = this.reviews.length;
    this.averageRating = this.totalReviews
      ? this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.totalReviews
      : 0;
    this.calculateRatingDistribution();
    this.applyFilter();
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

  startEdit(review: Review): void {
    if (!this.isStudentView) return;
    this.editingReviewId = review.id;
    this.editRating = review.rating;
    this.editComment = review.text;
  }

  cancelEdit(): void {
    this.editingReviewId = null;
    this.editRating = 0;
    this.editComment = '';
  }

  saveEdit(): void {
    if (!this.editingReviewId) return;
    const payload = { rating: this.editRating, comment: this.editComment };
    this.studentService.updateReview(this.editingReviewId, payload).subscribe({
      next: () => {
        const review = this.reviews.find(r => r.id === this.editingReviewId);
        if (review) {
          review.rating = this.editRating;
          review.text = this.editComment;
        }
        this.notificationService.showSuccess('Review updated');
        this.cancelEdit();
        this.recomputeStats();
      },
      error: () => this.notificationService.showError('Failed to update review')
    });
  }

  deleteReview(reviewId: string): void {
    if (!this.isStudentView) return;
    this.studentService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        this.notificationService.showSuccess('Review deleted');
        this.recomputeStats();
      },
      error: () => this.notificationService.showError('Failed to delete review')
    });
  }
}


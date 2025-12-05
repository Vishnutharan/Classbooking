import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TeacherService } from '../../core/services/teacher.service';
import { TeacherProfile } from '../../core/models/shared.models';
import { NotificationService } from '../../core/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-profile.component.html',
  styleUrl: './teacher-profile.component.css'
})
export class TeacherProfileComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  teacher: TeacherProfile | null = null;
  reviews: any[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadTeacherProfile(params['id']);
      }
    });
  }

  private loadTeacherProfile(id: string): void {
    this.isLoading = true;
    this.teacherService.getTeacherById(id).subscribe({
      next: (teacher) => {
        this.teacher = teacher;
        this.loadReviews(id);
      },
      error: () => {
        this.notificationService.showError('Failed to load teacher profile');
        this.isLoading = false;
      }
    });
  }

  private loadReviews(teacherId: string): void {
    this.teacherService.getTeacherReviews(teacherId).subscribe({
      next: (reviews) => {
        this.reviews = reviews.map(r => ({
          ...r,
          text: r.comment || r.text || '',
          date: new Date(r.createdAt || r.date)
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  bookClass(): void {
    const queryParams: any = {
        teacherId: this.teacher?.id
    };
    
    // Forward existing query params (context)
    const currentParams = this.route.snapshot.queryParams;
    if (currentParams['subject']) queryParams['subject'] = currentParams['subject'];
    if (currentParams['grade']) queryParams['grade'] = currentParams['grade'];

    this.router.navigate(['/book-class'], { queryParams });
  }

  shareProfile(): void {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: this.teacher?.fullName,
        text: `Check out ${this.teacher?.fullName}'s profile`,
        url: url
      }).catch(() => {
        this.copyToClipboard(url);
      });
    } else {
      this.copyToClipboard(url);
    }
  }

  private copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.notificationService.showSuccess('Profile link copied to clipboard');
    });
  }

  getDayName(day: string): string {
    return day;
  }
}

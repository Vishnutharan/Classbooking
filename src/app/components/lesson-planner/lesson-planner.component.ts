import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherDataService } from '../../core/services/teacher-data.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { LessonPlan } from '../../core/models/lesson-plan.models';

@Component({
    selector: 'app-lesson-planner',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="planner-container">
      <div class="header">
        <h1>📝 Lesson Planner</h1>
        <button class="btn-primary" (click)="createLesson()">+ Create Lesson Plan</button>
      </div>

      <div class="lessons-grid">
        <div class="lesson-card" *ngFor="let lesson of lessonPlans">
          <div class="lesson-header">
            <h3>{{ lesson.title }}</h3>
            <span class="status-badge" [ngClass]="'status-' + lesson.status.toLowerCase()">
              {{ lesson.status }}
            </span>
          </div>
          <p class="description">{{ lesson.description }}</p>
          <div class="lesson-meta">
            <span>📚 {{ lesson.subject }}</span>
            <span>🎓 {{ lesson.grade }}</span>
            <span>⏱️ {{ lesson.duration }} mins</span>
          </div>
          <div *ngIf="lesson.scheduledDate" class="scheduled-date">
            📅 Scheduled: {{ lesson.scheduledDate | date:'MMM dd, yyyy' }}
          </div>
          <div class="lesson-actions">
            <button class="btn-edit">Edit</button>
            <button class="btn-delete" (click)="deleteLesson(lesson.id)">Delete</button>
          </div>
        </div>
      </div>

      <div *ngIf="lessonPlans.length === 0" class="empty-state">
        <p>No lesson plans yet. Create your first lesson plan!</p>
      </div>
    </div>
  `,
    styles: [`
    .planner-container { padding: 2rem; max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header h1 { font-size: 2rem; color: #333; margin: 0; }
    .btn-primary { padding: 0.75rem 1.5rem; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }
    .btn-primary:hover { background: #45a049; }
    .lessons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
    .lesson-card { background: white; border: 2px solid #e0e0e0; border-radius: 12px; padding: 1.5rem; transition: all 0.3s ease; }
    .lesson-card:hover { box-shadow: 0 6px 12px rgba(0,0,0,0.1); border-color: #667eea; }
    .lesson-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; }
    .lesson-header h3 { margin: 0; color: #333; font-size: 1.2rem; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 600; }
    .status-draft { background: #fff3e0; color: #FF9800; }
    .status-planned { background: #e3f2fd; color: #2196F3; }
    .status-in.progress { background: #fff9c4; color: #F57C00; }
    .status-completed { background: #e8f5e9; color: #4CAF50; }
    .description { color: #666; margin-bottom: 1rem; line-height: 1.6; }
    .lesson-meta { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .lesson-meta span { padding: 0.5rem 0.75rem; background: #f5f5f5; border-radius: 6px; font-size: 0.9rem; }
    .scheduled-date { background: #e8f5e9; padding: 0.5rem 1rem; border-radius: 6px; color: #4CAF50; font-weight: 500; margin-bottom: 1rem; }
    .lesson-actions { display: flex; gap: 0.75rem; }
    .btn-edit { flex: 1; padding: 0.5rem; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; }
    .btn-delete { flex: 1; padding: 0.5rem; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; }
    .empty-state { text-align: center; padding: 3rem; color: #999; font-size: 1.1rem; }
  `]
})
export class LessonPlannerComponent implements OnInit {
    private teacherDataService = inject(TeacherDataService);
    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);

    lessonPlans: LessonPlan[] = [];

    ngOnInit(): void {
        this.loadLessonPlans();
    }

    loadLessonPlans(): void {
        const user = this.authService.getCurrentUser();
        if (!user) return;

        this.teacherDataService.getLessonPlans(user.id).subscribe({
            next: (plans) => {
                this.lessonPlans = plans;
            },
            error: () => {
                this.notificationService.showError('Failed to load lesson plans');
            }
        });
    }

    createLesson(): void {
        this.notificationService.showSuccess('Lesson plan creation form coming soon!');
    }

    deleteLesson(planId: string): void {
        if (confirm('Are you sure you want to delete this lesson plan?')) {
            this.teacherDataService.deleteLessonPlan(planId).subscribe({
                next: () => {
                    this.notificationService.showSuccess('Lesson plan deleted');
                    this.loadLessonPlans();
                },
                error: () => {
                    this.notificationService.showError('Failed to delete lesson plan');
                }
            });
        }
    }
}

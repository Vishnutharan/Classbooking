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
        <button class="btn-primary" *ngIf="!showForm" (click)="openForm()">+ Create Lesson Plan</button>
      </div>

      <!-- Lesson Plan Form -->
      <div class="lesson-form-card" *ngIf="showForm">
        <h2>{{ isEditing ? 'Edit' : 'Create' }} Lesson Plan</h2>
        <form (ngSubmit)="saveLesson()">
          <div class="form-grid">
            <div class="form-group">
              <label>Title</label>
              <input type="text" [(ngModel)]="currentLesson.title" name="title" required placeholder="e.g. Introduction to Algebra">
            </div>
            <div class="form-group">
              <label>Subject</label>
              <input type="text" [(ngModel)]="currentLesson.subject" name="subject" required placeholder="e.g. Mathematics">
            </div>
            <div class="form-group">
              <label>Grade/Level</label>
              <input type="text" [(ngModel)]="currentLesson.grade" name="grade" required placeholder="e.g. Grade 10">
            </div>
            <div class="form-group">
              <label>Duration (mins)</label>
              <input type="number" [(ngModel)]="currentLesson.duration" name="duration" required>
            </div>
            <div class="form-group">
              <label>Scheduled Date</label>
              <input type="date" [ngModel]="currentLesson.scheduledDate | date:'yyyy-MM-dd'" (ngModelChange)="currentLesson.scheduledDate = $event" name="scheduledDate">
            </div>
            <div class="form-group">
              <label>Status</label>
              <select [(ngModel)]="currentLesson.status" name="status">
                <option value="Draft">Draft</option>
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div class="form-group full-width">
            <label>Description</label>
            <textarea [(ngModel)]="currentLesson.description" name="description" rows="3" placeholder="Brief overview of the lesson..."></textarea>
          </div>

          <div class="form-group full-width">
            <label>Learning Objectives</label>
            <textarea [(ngModel)]="currentLesson.objectives" name="objectives" rows="3" placeholder="What will students learn?"></textarea>
          </div>

          <div class="form-group full-width">
            <label>Materials Needed</label>
            <textarea [(ngModel)]="currentLesson.materials" name="materials" rows="2" placeholder="Textbooks, worksheets, etc."></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="cancelForm()">Cancel</button>
            <button type="submit" class="btn-primary">💾 Save Lesson Plan</button>
          </div>
        </form>
      </div>

      <!-- Lessons Grid -->
      <div class="lessons-grid" *ngIf="!showForm">
        <div class="lesson-card" *ngFor="let lesson of lessonPlans">
          <div class="lesson-header">
            <h3>{{ lesson.title }}</h3>
            <span class="status-badge" [ngClass]="'status-' + lesson.status.toLowerCase().replace(' ', '-')">
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
            <button class="btn-edit" (click)="editLesson(lesson)">Edit</button>
            <button class="btn-delete" (click)="deleteLesson(lesson.id)">Delete</button>
          </div>
        </div>
      </div>

      <div *ngIf="!showForm && lessonPlans.length === 0" class="empty-state">
        <p>No lesson plans yet. Create your first lesson plan!</p>
      </div>
    </div>
  `,
    styles: [`
    .planner-container { padding: 2rem; max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header h1 { font-size: 2rem; color: #333; margin: 0; }
    
    .btn-primary { padding: 0.75rem 1.5rem; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; transition: all 0.3s ease; }
    .btn-primary:hover { background: #45a049; transform: translateY(-2px); }
    
    .btn-secondary { padding: 0.75rem 1.5rem; background: #f5f5f5; color: #333; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; font-size: 1rem; transition: all 0.3s ease; }
    .btn-secondary:hover { background: #e0e0e0; }

    /* Form Styles */
    .lesson-form-card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 2rem; border: 1px solid #e0e0e0; }
    .lesson-form-card h2 { margin-top: 0; margin-bottom: 1.5rem; color: #333; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group.full-width { grid-column: 1 / -1; }
    .form-group label { font-weight: 500; color: #555; font-size: 0.9rem; }
    .form-group input, .form-group select, .form-group textarea { padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #4CAF50; outline: none; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }

    /* Grid Styles */
    .lessons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
    .lesson-card { background: white; border: 2px solid #e0e0e0; border-radius: 12px; padding: 1.5rem; transition: all 0.3s ease; display: flex; flex-direction: column; }
    .lesson-card:hover { box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-color: #667eea; transform: translateY(-2px); }
    .lesson-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; }
    .lesson-header h3 { margin: 0; color: #333; font-size: 1.2rem; font-weight: 600; }
    
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .status-draft { background: #fff3e0; color: #FF9800; }
    .status-planned { background: #e3f2fd; color: #2196F3; }
    .status-in-progress { background: #fff9c4; color: #F57C00; }
    .status-completed { background: #e8f5e9; color: #4CAF50; }
    
    .description { color: #666; margin-bottom: 1rem; line-height: 1.6; flex-grow: 1; }
    .lesson-meta { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .lesson-meta span { padding: 0.4rem 0.8rem; background: #f8f9fa; border-radius: 6px; font-size: 0.85rem; color: #555; border: 1px solid #eee; }
    .scheduled-date { background: #f0fdf4; padding: 0.6rem 1rem; border-radius: 8px; color: #166534; font-weight: 500; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; border: 1px solid #bbf7d0; }
    
    .lesson-actions { display: flex; gap: 0.75rem; margin-top: auto; }
    .btn-edit { flex: 1; padding: 0.6rem; background: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-edit:hover { background: #dbeafe; }
    .btn-delete { flex: 1; padding: 0.6rem; background: #fef2f2; color: #b91c1c; border: 1px solid #fee2e2; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-delete:hover { background: #fee2e2; }
    
    .empty-state { text-align: center; padding: 4rem 2rem; color: #9ca3af; font-size: 1.1rem; background: #f9fafb; border-radius: 12px; border: 2px dashed #e5e7eb; }
  `]
})
export class LessonPlannerComponent implements OnInit {
    private teacherDataService = inject(TeacherDataService);
    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);

    lessonPlans: LessonPlan[] = [];
    showForm = false;
    isEditing = false;
    
    currentLesson: any = {
        title: '',
        subject: '',
        grade: '',
        duration: 60,
        status: 'Draft',
        description: '',
        objectives: '',
        materials: '',
        scheduledDate: null
    };

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

    openForm(): void {
        this.showForm = true;
        this.isEditing = false;
        this.resetForm();
    }

    editLesson(lesson: LessonPlan): void {
        this.showForm = true;
        this.isEditing = true;
        this.currentLesson = { ...lesson };
    }

    cancelForm(): void {
        this.showForm = false;
        this.resetForm();
    }

    resetForm(): void {
        this.currentLesson = {
            title: '',
            subject: '',
            grade: '',
            duration: 60,
            status: 'Draft',
            description: '',
            objectives: '',
            materials: '',
            scheduledDate: null
        };
    }

    saveLesson(): void {
        const user = this.authService.getCurrentUser();
        if (!user) return;

        const lessonToSave = {
            ...this.currentLesson,
            teacherId: user.id
        };

        this.teacherDataService.saveLessonPlan(lessonToSave).subscribe({
            next: () => {
                this.notificationService.showSuccess(this.isEditing ? 'Lesson plan updated' : 'Lesson plan created');
                this.showForm = false;
                this.loadLessonPlans();
            },
            error: () => {
                this.notificationService.showError('Failed to save lesson plan');
            }
        });
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

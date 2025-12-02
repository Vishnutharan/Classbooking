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
    templateUrl: './lesson-planner.component.html',
    styleUrls: ['./lesson-planner.component.css']
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

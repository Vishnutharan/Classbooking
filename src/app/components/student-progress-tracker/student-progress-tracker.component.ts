import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectPerformance, StudyGoal } from '../../core/models/shared.models';
import { AuthService } from '../../core/services/auth.service';
import { StudentService } from '../../core/services/student.service';
import { forkJoin } from 'rxjs';

interface ProgressMetrics {
    overallAverage: number;
    totalStudyHours: number;
    completedClasses: number;
    upcomingExams: { name: string; date: Date; daysRemaining: number }[];
}

@Component({
    selector: 'app-student-progress-tracker',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './student-progress-tracker.component.html',
    styleUrl: './student-progress-tracker.component.css'
})
export class StudentProgressTrackerComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);

    currentUser: any;
    subjectPerformance: SubjectPerformance[] = [];
    studyGoals: StudyGoal[] = [];
    progressMetrics: ProgressMetrics = {
        overallAverage: 0,
        totalStudyHours: 0,
        completedClasses: 0,
        upcomingExams: []
    };
    isLoading = false;

    private studentService = inject(StudentService);

    ngOnInit(): void {
        this.currentUser = this.authService.getCurrentUser();
        if (!this.currentUser) {
            this.router.navigate(['/auth']);
            return;
        }
        this.loadProgressData();
    }

    private loadProgressData(): void {
        this.isLoading = true;

        forkJoin({
            progress: this.studentService.getProgressReport(),
            goals: this.studentService.getStudyGoals()
        }).subscribe({
            next: ({ progress, goals }) => {
                this.subjectPerformance = progress;
                this.studyGoals = goals;
                this.calculateProgressMetrics();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading progress data', error);
                this.isLoading = false;
            }
        });
    }

    private calculateProgressMetrics(): void {
        // Calculate overall average
        if (this.subjectPerformance.length > 0) {
            const totalScore = this.subjectPerformance.reduce((sum, perf) => sum + perf.averageScore, 0);
            this.progressMetrics.overallAverage = Math.round(totalScore / this.subjectPerformance.length);
        }

        // Calculate total study hours
        this.progressMetrics.totalStudyHours = this.subjectPerformance.reduce((sum, perf) => sum + perf.studyHours, 0);

        // Calculate completed classes
        this.progressMetrics.completedClasses = this.subjectPerformance.reduce((sum, perf) => sum + perf.totalClasses, 0);

        // Upcoming exams (demo data)
        this.progressMetrics.upcomingExams = [
            { name: 'A/L Physics Mock Exam', date: new Date('2025-12-15'), daysRemaining: this.calculateDaysRemaining(new Date('2025-12-15')) },
            { name: 'A/L Chemistry Mock Exam', date: new Date('2025-12-18'), daysRemaining: this.calculateDaysRemaining(new Date('2025-12-18')) },
            { name: 'A/L Combined Maths Mock Exam', date: new Date('2025-12-20'), daysRemaining: this.calculateDaysRemaining(new Date('2025-12-20')) }
        ];
    }

    private calculateDaysRemaining(targetDate: Date): number {
        const today = new Date();
        const diffTime = targetDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    getPerformanceColor(level: string): string {
        switch (level) {
            case 'Excellent': return '#28a745'; // Green
            case 'Good': return '#17a2b8'; // Blue
            case 'Average': return '#ffc107'; // Yellow  
            case 'NeedsImprovement': return '#dc3545'; // Red
            default: return '#6c757d'; // Gray
        }
    }

    getGoalProgress(goal: StudyGoal): number {
        if (!goal.targetValue || !goal.currentValue) return 0;
        return Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
    }

    getGoalStatusClass(status: string): string {
        return status.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    navigateToStudyGoals(): void {
        this.router.navigate(['/student/study-goals']);
    }

    navigateToBookClass(): void {
        this.router.navigate(['/book-class']);
    }
}

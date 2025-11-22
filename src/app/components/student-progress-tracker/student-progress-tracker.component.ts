import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectPerformance, StudyGoal } from '../../core/models/shared.models';
import { AuthService } from '../../core/services/auth.service';

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

        // Demo data for subject performance - in production, this would come from API
        this.subjectPerformance = [
            {
                subject: 'Mathematics',
                averageScore: 78,
                totalClasses: 12,
                studyHours: 24,
                lastClassDate: new Date('2025-11-20'),
                performanceLevel: 'Good',
                weakAreas: ['Calculus', 'Trigonometry'],
                recommendations: ['Practice more calculus problems', 'Review trigonometric identities']
            },
            {
                subject: 'Physics',
                averageScore: 65,
                totalClasses: 10,
                studyHours: 18,
                lastClassDate: new Date('2025-11-19'),
                performanceLevel: 'Average',
                weakAreas: ['Quantum Mechanics', 'Thermodynamics'],
                recommendations: ['Focus on quantum mechanics concepts', 'Complete thermodynamics assignments']
            },
            {
                subject: 'Chemistry',
                averageScore: 85,
                totalClasses: 14,
                studyHours: 28,
                lastClassDate: new Date('2025-11-21'),
                performanceLevel: 'Excellent',
                weakAreas: [],
                recommendations: ['Maintain current study pace', 'Help peers with chemistry']
            },
            {
                subject: 'Combined Mathematics',
                averageScore: 72,
                totalClasses: 15,
                studyHours: 30,
                lastClassDate: new Date('2025-11-18'),
                performanceLevel: 'Good',
                weakAreas: ['Integration', 'Differential Equations'],
                recommendations: ['More practice on integration techniques', 'Review differential equations theory']
            },
            {
                subject: 'English',
                averageScore: 88,
                totalClasses: 8,
                studyHours: 16,
                lastClassDate: new Date('2025-11-17'),
                performanceLevel: 'Excellent',
                weakAreas: [],
                recommendations: ['Excellent performance', 'Consider advanced literature']
            }
        ];

        // Demo data for study goals
        this.studyGoals = [
            {
                id: 'goal-1',
                studentId: this.currentUser.id,
                title: 'Complete Physics Chapter 5',
                description: 'Finish all exercises in Quantum Mechanics chapter',
                targetDate: new Date('2025-11-30'),
                subject: 'Physics',
                goalType: 'ChapterCompletion',
                targetValue: 100,
                currentValue: 65,
                status: 'InProgress',
                createdAt: new Date('2025-11-15'),
                updatedAt: new Date('2025-11-20')
            },
            {
                id: 'goal-2',
                studentId: this.currentUser.id,
                title: 'Study 20 hours this week',
                description: 'Maintain weekly study schedule',
                targetDate: new Date('2025-11-28'),
                goalType: 'StudyHours',
                targetValue: 20,
                currentValue: 12,
                status: 'InProgress',
                createdAt: new Date('2025-11-18'),
                updatedAt: new Date('2025-11-22')
            },
            {
                id: 'goal-3',
                studentId: this.currentUser.id,
                title: 'Complete 2023 A/L Past Paper',
                description: 'Attempt and review 2023 A/L Physics past paper',
                targetDate: new Date('2025-12-05'),
                subject: 'Physics',
                goalType: 'PastPaper',
                targetValue: 1,
                currentValue: 0,
                status: 'NotStarted',
                createdAt: new Date('2025-11-20'),
                updatedAt: new Date('2025-11-20')
            },
            {
                id: 'goal-4',
                studentId: this.currentUser.id,
                title: 'Improve Chemistry score to 90%',
                description: 'Target 90% average in Chemistry',
                targetDate: new Date('2025-12-31'),
                subject: 'Chemistry',
                goalType: 'Other',
                targetValue: 90,
                currentValue: 85,
                status: 'InProgress',
                createdAt: new Date('2025-11-01'),
                updatedAt: new Date('2025-11-21')
            }
        ];

        // Calculate metrics
        this.calculateProgressMetrics();

        this.isLoading = false;
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

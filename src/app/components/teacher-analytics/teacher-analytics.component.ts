import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherDataService } from '../../core/services/teacher-data.service';
import { AuthService } from '../../core/services/auth.service';
import { TeacherMetrics, EarningsAnalytics, SubjectPerformance } from '../../core/models/teacher-analytics.models';

@Component({
    selector: 'app-teacher-analytics',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './teacher-analytics.component.html',
    styleUrls: ['./teacher-analytics.component.css']
})
export class TeacherAnalyticsComponent implements OnInit {
    private teacherDataService = inject(TeacherDataService);
    private authService = inject(AuthService);

    metrics: TeacherMetrics | null = null;
    earnings: EarningsAnalytics | null = null;
    subjectPerformance: SubjectPerformance[] = [];

    ngOnInit(): void {
        this.loadAnalytics();
    }

    loadAnalytics(): void {
        const user = this.authService.getCurrentUser();
        if (!user) return;

        this.teacherDataService.getTeacherAnalytics(user.id, 'monthly').subscribe({
            next: (metrics) => {
                this.metrics = metrics;
            }
        });

        this.teacherDataService.getEarningsAnalytics(user.id, 'monthly').subscribe({
            next: (earnings) => {
                this.earnings = earnings;
            }
        });

        this.teacherDataService.getSubjectPerformance(user.id).subscribe({
            next: (performance) => {
                this.subjectPerformance = performance;
            }
        });
    }
}

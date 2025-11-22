import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TeacherDataService } from '../../core/services/teacher-data.service';
import { AuthService } from '../../core/services/auth.service';
import { TeacherMetrics, EarningsAnalytics, SubjectPerformance } from '../../core/models/teacher-analytics.models';

@Component({
    selector: 'app-teacher-analytics',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="analytics-container">
      <h1>📊 Teacher Analytics</h1>

      <!-- KPIs -->
      <div class="kpi-grid" *ngIf="metrics">
        <div class="kpi-card">
          <div class="kpi-icon">👥</div>
          <h3>{{ metrics.totalStudents }}</h3>
          <p>Total Students</p>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">📚</div>
          <h3>{{ metrics.completedClasses }}</h3>
          <p>Classes Completed</p>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">⭐</div>
          <h3>{{ metrics.averageRating | number:'1.1-1' }}</h3>
          <p>Average Rating</p>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">📈</div>
          <h3>{{ metrics.averageAttendance }}%</h3>
          <p>Avg Attendance</p>
        </div>
      </div>

      <!-- Earnings Section -->
      <div class="section" *ngIf="earnings">
        <h2>💰 Earnings Analytics</h2>
        <div class="earnings-summary">
          <div class="summary-card">
            <h4>Total Earnings</h4>
            <p class="big-number">LKR {{ earnings.totalEarnings | number:'1.0-0' }}</p>
          </div>
          <div class="summary-card">
            <h4>Projected</h4>
            <p class="big-number">LKR {{ earnings.projectedEarnings | number:'1.0-0' }}</p>
          </div>
          <div class="summary-card">
            <h4>Avg Hourly Rate</h4>
            <p class="big-number">LKR {{ earnings.averageHourlyRate | number:'1.0-0' }}</p>
          </div>
          <div class="summary-card">
            <h4>Total Hours</h4>
            <p class="big-number">{{ earnings.totalHoursTeaching }}</p>
          </div>
        </div>

        <h3>Earnings by Subject</h3>
        <div class="subject-earnings">
          <div class="subject-bar" *ngFor="let subj of earnings.earningsBySubject">
            <div class="subject-label">{{ subj.subject }}</div>
            <div class="bar-container">
              <div class="bar" [style.width.%]="subj.percentage"></div>
            </div>
            <div class="subject-value">LKR {{ subj.earnings | number:'1.0-0' }}</div>
          </div>
        </div>
      </div>

      <!-- Subject Performance -->
      <div class="section" *ngIf="subjectPerformance && subjectPerformance.length > 0">
        <h2>📈 Subject Performance</h2>
        <div class="performance-grid">
          <div class="performance-card" *ngFor="let perf of subjectPerformance">
            <h3>{{ perf.subject }}</h3>
            <div class="perf-stats">
              <div class="perf-stat">
                <span class="label">Students</span>
                <span class="value">{{ perf.totalStudents }}</span>
              </div>
              <div class="perf-stat">
                <span class="label">Avg Score   </span>
                <span class="value">{{ perf.averageScore | number:'1.0-0' }}%</span>
              </div>
              <div class="perf-stat">
                <span class="label">Pass Rate</span>
                <span class="value">{{ perf.passRate | number:'1.0-0' }}%</span>
              </div>
              <div class="perf-stat">
                <span class="label">Satisfaction</span>
                <span class="value">{{ perf.studentSatisfaction | number:'1.1-1' }}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .analytics-container { padding: 2rem; max-width: 1400px; margin: 0 auto; }
    h1 { font-size: 2rem; color: #333; margin-bottom: 2rem; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
    .kpi-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 12px; text-align: center; }
    .kpi-card:nth-child(2) { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .kpi-card:nth-child(3) { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .kpi-card:nth-child(4) { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    .kpi-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .kpi-card h3 { font-size: 2.5rem; margin: 0.5rem 0; }
    .kpi-card p { font-size: 1rem; opacity: 0.9; margin: 0; }
    .section { background: white; border-radius: 12px; padding: 2rem; margin-bottom: 2rem; border: 2px solid #e0e0e0; }
    .section h2 { margin: 0 0 1.5rem; color: #333; }
    .earnings-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .summary-card { background: #f5f5f5; padding: 1.5rem; border-radius: 8px; text-align: center; }
    .summary-card h4 { margin: 0 0 0.5rem; color: #666; font-size: 0.9rem; font-weight: 500; }
    .big-number { font-size: 1.8rem; font-weight: bold; color: #667eea; margin: 0; }
    .subject-earnings { display: flex; flex-direction: column; gap: 1rem; }
    .subject-bar { display: grid; grid-template-columns: 150px 1fr 150px; align-items: center; gap: 1rem; }
    .subject-label { font-weight: 600; color: #333; }
    .bar-container { background: #e0e0e0; height: 30px; border-radius: 15px; overflow: hidden; }
    .bar { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); height: 100%; transition: width 1s ease; }
    .subject-value { text-align: right; font-weight: 600; color: #667eea; }
    .performance-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
    .performance-card { background: #f5f5f5; padding: 1.5rem; border-radius: 12px; }
    .performance-card h3 { margin: 0 0 1rem; color: #333; }
    .perf-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .perf-stat { display: flex; flex-direction: column; }
    .perf-stat .label { font-size: 0.85rem; color: #666; margin-bottom: 0.25rem; }
    .perf-stat .value { font-size: 1.3rem; font-weight: bold; color: #667eea; }
  `]
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

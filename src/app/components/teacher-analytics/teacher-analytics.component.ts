import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherDataService } from '../../core/services/teacher-data.service';
import { AuthService } from '../../core/services/auth.service';
import { TeacherMetrics, EarningsAnalytics, SubjectPerformance } from '../../core/models/teacher-analytics.models';

@Component({
    selector: 'app-teacher-analytics',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="analytics-container">
      <div class="analytics-header">
        <div>
          <p class="eyebrow">Performance</p>
          <h1>Teacher Analytics</h1>
          <p class="lede">See how your classes, students, and earnings are progressing.</p>
        </div>
        <button class="link-btn" (click)="loadAnalytics()">Refresh data</button>
      </div>

      <div class="kpi-grid" *ngIf="metrics">
        <div class="kpi-card">
          <div class="kpi-icon chip-green">Students</div>
          <h3>{{ metrics.totalStudents }}</h3>
          <p>Total students</p>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon chip-blue">Classes</div>
          <h3>{{ metrics.completedClasses }}</h3>
          <p>Classes completed</p>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon chip-amber">Rating</div>
          <h3>{{ metrics.averageRating | number:'1.1-1' }}</h3>
          <p>Average rating</p>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon chip-purple">Attendance</div>
          <h3>{{ metrics.averageAttendance }}%</h3>
          <p>Avg attendance</p>
        </div>
      </div>

      <div class="section" *ngIf="earnings">
        <h2>Earnings analytics</h2>
        <div class="earnings-summary">
          <div class="summary-card">
            <h4>Total earnings</h4>
            <p class="big-number">LKR {{ earnings.totalEarnings | number:'1.0-0' }}</p>
          </div>
          <div class="summary-card">
            <h4>Projected</h4>
            <p class="big-number">LKR {{ earnings.projectedEarnings | number:'1.0-0' }}</p>
          </div>
          <div class="summary-card">
            <h4>Avg hourly rate</h4>
            <p class="big-number">LKR {{ earnings.averageHourlyRate | number:'1.0-0' }}</p>
          </div>
          <div class="summary-card">
            <h4>Total hours</h4>
            <p class="big-number">{{ earnings.totalHoursTeaching }}</p>
          </div>
        </div>

        <h3>Earnings by subject</h3>
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

      <div class="section" *ngIf="subjectPerformance && subjectPerformance.length > 0">
        <h2>Subject performance</h2>
        <div class="performance-grid">
          <div class="performance-card" *ngFor="let perf of subjectPerformance">
            <h3>{{ perf.subject }}</h3>
            <div class="perf-stats">
              <div class="perf-stat">
                <span class="label">Students</span>
                <span class="value">{{ perf.totalStudents }}</span>
              </div>
              <div class="perf-stat">
                <span class="label">Avg Score</span>
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
    .analytics-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .analytics-header { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; margin-bottom: 1.5rem; }
    .eyebrow { text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; color: #2563eb; margin: 0; font-size: 0.8rem; }
    h1 { font-size: 2rem; color: #0f172a; margin: 4px 0 6px; letter-spacing: -0.5px; }
    .lede { margin: 0; color: #475569; }
    .link-btn { background: none; border: 1px solid #dbeafe; color: #1d4ed8; padding: 10px 14px; border-radius: 12px; font-weight: 700; cursor: pointer; }
    .link-btn:hover { background: #e0ecff; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .kpi-card { background: #0f172a; color: #e2e8f0; padding: 1.25rem; border-radius: 12px; }
    .kpi-icon { display: inline-flex; padding: 6px 10px; border-radius: 10px; background: #111827; font-size: 0.9rem; font-weight: 700; color: #0f172a; }
    .chip-green { background: #a7f3d0; }
    .chip-blue { background: #bfdbfe; }
    .chip-amber { background: #fde68a; }
    .chip-purple { background: #e9d5ff; }
    .kpi-card h3 { font-size: 2rem; margin: 0.25rem 0; }
    .kpi-card p { margin: 0; opacity: 0.9; font-weight: 600; }
    .section { background: #ffffff; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #e2e8f0; }
    .section h2 { margin: 0 0 1rem; color: #0f172a; }
    .earnings-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .summary-card { background: #f8fafc; padding: 1rem; border-radius: 10px; text-align: center; border: 1px solid #e2e8f0; }
    .summary-card h4 { margin: 0 0 0.5rem; color: #475569; font-size: 0.95rem; font-weight: 700; }
    .big-number { font-size: 1.6rem; font-weight: 800; color: #1d4ed8; margin: 0; }
    .subject-earnings { display: flex; flex-direction: column; gap: 0.75rem; }
    .subject-bar { display: grid; grid-template-columns: 140px 1fr 120px; align-items: center; gap: 0.75rem; }
    .subject-label { font-weight: 700; color: #0f172a; }
    .bar-container { background: #e2e8f0; height: 26px; border-radius: 13px; overflow: hidden; }
    .bar { background: linear-gradient(90deg, #1d4ed8 0%, #7c3aed 100%); height: 100%; transition: width 0.6s ease; }
    .subject-value { text-align: right; font-weight: 700; color: #1d4ed8; }
    .performance-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
    .performance-card { background: #f8fafc; padding: 1.2rem; border-radius: 12px; border: 1px solid #e2e8f0; }
    .performance-card h3 { margin: 0 0 0.75rem; color: #0f172a; }
    .perf-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .perf-stat { display: flex; flex-direction: column; gap: 4px; }
    .perf-stat .label { font-size: 0.85rem; color: #475569; }
    .perf-stat .value { font-size: 1.1rem; font-weight: 800; color: #1d4ed8; }
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

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ProgressMetrics {
  completedModules: number;
  totalModules: number;
  averageScore: number;
  studyHours: number;
  currentStreak: number;
  badges: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgressTrackingService {
  private http = inject(HttpClient);
  private apiUrl = 'api/progress';

  getStudentProgress(studentId: string): Observable<ProgressMetrics> {
    return this.http.get<ProgressMetrics>(`${this.apiUrl}/${studentId}`);
  }

  updateProgress(studentId: string, activityId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${studentId}/activity/${activityId}`, data);
  }

  calculateCompletionPercentage(metrics: ProgressMetrics): number {
    if (metrics.totalModules === 0) return 0;
    return Math.round((metrics.completedModules / metrics.totalModules) * 100);
  }

  checkGoals(metrics: ProgressMetrics, goals: any): { achieved: boolean; remaining: any } {
    // Logic to check if student met weekly goals
    const achieved = metrics.studyHours >= goals.targetHours;
    return {
      achieved,
      remaining: achieved ? 0 : goals.targetHours - metrics.studyHours
    };
  }

  generateCertificate(courseId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/certificate/${courseId}`, { responseType: 'blob' });
  }

  getStudyStreak(studentId: string): Observable<number> {
    return this.http.get<{ streak: number }>(`${this.apiUrl}/${studentId}/streak`)
      .pipe(map(res => res.streak));
  }
}
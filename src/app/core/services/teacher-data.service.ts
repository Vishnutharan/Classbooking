import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Import all teacher feature models
import {
    AttendanceRecord,
    AttendanceStats,
    StudentAttendanceSummary
} from '../models/teacher-attendance.models';

import {
    TeacherStudent,
    StudentProgress
} from '../models/teacher-student-management.models';

import {
    LessonPlan
} from '../models/lesson-plan.models';

import {
    TeacherMetrics,
    EarningsAnalytics,
    SubjectPerformance
} from '../models/teacher-analytics.models';

import {
    TeacherMessage,
    Conversation,
    Announcement
} from '../models/teacher-communication.models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TeacherDataService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/teacher`;

    // --- ATTENDANCE DATA ---

    getAttendanceRecords(teacherId: string, startDate?: Date, endDate?: Date): Observable<AttendanceRecord[]> {
        let params = new HttpParams();
        if (startDate) params = params.set('startDate', startDate.toISOString());
        if (endDate) params = params.set('endDate', endDate.toISOString());

        return this.http.get<AttendanceRecord[]>(`${this.apiUrl}/attendance`, { params });
    }

    markAttendance(records: AttendanceRecord[]): Observable<boolean> {
        return this.http.post<boolean>(`${this.apiUrl}/attendance`, records);
    }

    // --- STUDENT MANAGEMENT DATA ---

    getTeacherStudents(teacherId: string): Observable<TeacherStudent[]> {
        return this.http.get<TeacherStudent[]>(`${this.apiUrl}/students`);
    }

    getStudentProgress(studentId: string): Observable<StudentProgress> {
        return this.http.get<StudentProgress>(`${this.apiUrl}/students/${studentId}/progress`);
    }

    // --- LESSON PLANNING DATA ---

    getLessonPlans(teacherId: string): Observable<LessonPlan[]> {
        return this.http.get<LessonPlan[]>(`${this.apiUrl}/lesson-plans`);
    }

    saveLessonPlan(plan: LessonPlan): Observable<LessonPlan> {
        if (plan.id && !plan.id.startsWith('lp-temp')) {
            return this.http.put<LessonPlan>(`${this.apiUrl}/lesson-plans/${plan.id}`, plan);
        } else {
            return this.http.post<LessonPlan>(`${this.apiUrl}/lesson-plans`, plan);
        }
    }

    deleteLessonPlan(planId: string): Observable<boolean> {
        return this.http.delete<boolean>(`${this.apiUrl}/lesson-plans/${planId}`);
    }

    // --- ANALYTICS DATA ---

    getTeacherAnalytics(teacherId: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Observable<TeacherMetrics> {
        return this.http.get<TeacherMetrics>(`${this.apiUrl}/analytics`, {
            params: { period }
        });
    }

    getEarningsAnalytics(teacherId: string, period: 'monthly' | 'yearly'): Observable<EarningsAnalytics> {
        return this.http.get<EarningsAnalytics>(`${this.apiUrl}/analytics/earnings`, {
            params: { period }
        });
    }

    getSubjectPerformance(teacherId: string): Observable<SubjectPerformance[]> {
        return this.http.get<SubjectPerformance[]>(`${this.apiUrl}/analytics/subjects`);
    }

    // --- COMMUNICATION DATA ---

    getConversations(teacherId: string): Observable<Conversation[]> {
        return this.http.get<Conversation[]>(`${this.apiUrl}/communication/conversations`);
    }

    getAnnouncements(teacherId: string): Observable<Announcement[]> {
        return this.http.get<Announcement[]>(`${this.apiUrl}/communication/announcements`);
    }

    sendMessage(message: TeacherMessage): Observable<boolean> {
        return this.http.post<boolean>(`${this.apiUrl}/communication/messages`, message);
    }

    createAnnouncement(announcement: Announcement): Observable<Announcement> {
        return this.http.post<Announcement>(`${this.apiUrl}/communication/announcements`, announcement);
    }
}

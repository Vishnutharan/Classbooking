import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherDataService } from '../../core/services/teacher-data.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import {
    AttendanceRecord,
    AttendanceStatus
} from '../../core/models/teacher-attendance.models';

@Component({
    selector: 'app-teacher-attendance',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './teacher-attendance.component.html',
    styleUrl: './teacher-attendance.component.css'
})
export class TeacherAttendanceComponent implements OnInit {
    private teacherDataService = inject(TeacherDataService);
    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);

    selectedDate: Date = new Date();
    attendanceRecords: AttendanceRecord[] = [];
    displayRecords: AttendanceRecord[] = [];
    isLoading = false;
    currentView: 'mark' | 'history' = 'mark';

    // For marking attendance - loaded from teacher's actual students
    studentsToMark: Array<{ id: string; name: string; status: AttendanceStatus }> = [];

    stats = {
        totalSessions: 0,
        averageAttendance: 0,
        presentCount: 0,
        absentCount: 0
    };

    ngOnInit(): void {
        this.loadAttendanceData();
    }

    loadAttendanceData(): void {
        this.isLoading = true;
        const user = this.authService.getCurrentUser();
        if (!user) return;

        this.teacherDataService.getAttendanceRecords(user.id).subscribe({
            next: (records) => {
                this.attendanceRecords = records;
                this.filterRecordsByDate();
                this.calculateStats();
                this.isLoading = false;
            },
            error: () => {
                this.notificationService.showError('Failed to load attendance data');
                this.isLoading = false;
            }
        });
        
        // Load students for marking attendance
        this.loadStudents();
    }
    
    loadStudents(): void {
        const user = this.authService.getCurrentUser();
        if (!user) return;
        
        this.teacherDataService.getTeacherStudents(user.id).subscribe({
            next: (students) => {
                this.studentsToMark = students.map(s => ({
                    id: s.userId,
                    name: s.fullName,
                    status: 'Present' as AttendanceStatus
                }));
            },
            error: () => {
                this.notificationService.showError('Failed to load students');
            }
        });
    }

    calculateStats(): void {
        this.stats.totalSessions = this.attendanceRecords.length;
        const present = this.attendanceRecords.filter(r => r.status === 'Present').length;
        const total = this.attendanceRecords.length;
        this.stats.averageAttendance = total > 0 ? Math.round((present / total) * 100) : 0;
        this.stats.presentCount = this.attendanceRecords.filter(r => r.status === 'Present').length;
        this.stats.absentCount = this.attendanceRecords.filter(r => r.status === 'Absent').length;
    }

    markAllPresent(): void {
        this.studentsToMark.forEach(s => s.status = 'Present');
    }

    markAllAbsent(): void {
        this.studentsToMark.forEach(s => s.status = 'Absent');
    }

    saveAttendance(): void {
        const user = this.authService.getCurrentUser();
        if (!user) return;

        const records: AttendanceRecord[] = this.studentsToMark.map(s => ({
            id: `att-${Date.now()}-${s.id}`,
            studentId: s.id,
            studentName: s.name,
            classId: `class-${Date.now()}`,
            subject: 'Mathematics',
            date: this.selectedDate,
            status: s.status,
            markedBy: user.id,
            markedAt: new Date()
        }));

        this.teacherDataService.markAttendance(records).subscribe({
            next: () => {
                this.notificationService.showSuccess('Attendance marked successfully');
                this.loadAttendanceData();
            },
            error: () => {
                this.notificationService.showError('Failed to save attendance');
            }
        });
    }

    filterRecordsByDate(): void {
        // Compare dates using ISO yyyy-mm-dd to avoid timezone drift
        const targetDateStr = this.toIsoDate(this.selectedDate);

        this.displayRecords = this.attendanceRecords.filter(r => {
            const recordDate = new Date(r.date);
            return this.toIsoDate(recordDate) === targetDateStr;
        });
    }

    private toIsoDate(date: Date): string {
        return new Date(date).toISOString().split('T')[0];
    }

    onDateChange(event: any): void {
        // Create date as local time (append time to avoid UTC interpretation)
        this.selectedDate = new Date(event.target.value + 'T00:00:00');
        this.filterRecordsByDate();
    }

    switchView(view: 'mark' | 'history'): void {
        this.currentView = view;
    }

    getStatusBadgeClass(status: AttendanceStatus): string {
        return {
            'Present': 'status-present',
            'Absent': 'status-absent',
            'Late': 'status-late',
            'Excused': 'status-excused'
        }[status] || '';
    }
}

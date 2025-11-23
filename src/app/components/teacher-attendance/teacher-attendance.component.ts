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

    // For marking attendance
    studentsToMark = [
        { id: 'student-1', name: 'Alice Fernando', status: 'Present' as AttendanceStatus },
        { id: 'student-2', name: 'Kamal Silva', status: 'Present' as AttendanceStatus },
        { id: 'student-3', name: 'Nimal Perera', status: 'Present' as AttendanceStatus },
        { id: 'student-4', name: 'Saman Jayawardena', status: 'Present' as AttendanceStatus },
        { id: 'student-5', name: 'Dilini Rajapaksha', status: 'Present' as AttendanceStatus }
    ];

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

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        this.teacherDataService.getAttendanceRecords(user.id, startDate).subscribe({
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
    }

    filterRecordsByDate(): void {
        this.displayRecords = this.attendanceRecords.filter(r => {
            const recordDate = new Date(r.date);
            return recordDate.toDateString() === this.selectedDate.toDateString();
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

    onDateChange(event: any): void {
        this.selectedDate = new Date(event.target.value);
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

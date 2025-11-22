/**
 * Teacher Attendance Management Models
 * Models for tracking student attendance in classes
 */

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
    id: string;
    studentId: string;
    studentName: string;
    classId: string;
    subject: string;
    date: Date;
    status: AttendanceStatus;
    notes?: string;
    markedBy: string; // teacher ID
    markedAt: Date;
}

export interface AttendanceSession {
    id: string;
    classId: string;
    teacherId: string;
    subject: string;
    date: Date;
    startTime: string;
    endTime: string;
    totalStudents: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;
    attendanceRecords: AttendanceRecord[];
    notes?: string;
    createdAt: Date;
}

export interface AttendanceStats {
    totalSessions: number;
    totalStudents: number;
    averageAttendanceRate: number;
    presentPercentage: number;
    absentPercentage: number;
    latePercentage: number;
    excusedPercentage: number;
    trendData: AttendanceTrend[];
}

export interface AttendanceTrend {
    date: Date;
    attendanceRate: number;
    presentCount: number;
    totalCount: number;
}

export interface StudentAttendanceSummary {
    studentId: string;
    studentName: string;
    totalClasses: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;
    attendanceRate: number;
    lastAttendance?: Date;
    consecutiveAbsences: number;
}

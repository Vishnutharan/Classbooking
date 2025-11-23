/**
 * Admin-related models
 * Extracted from admin.service.ts
 */

export interface DashboardStats {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalBookings: number;
    pendingBookings: number;
    completedBookings: number;
    totalRevenue: number;
    averageRating: number;
}

export interface CreateUserRequest {
    email: string;
    password: string;
    fullName: string;
    role: 'Student' | 'Teacher' | 'Admin';
    phoneNumber?: string;
}

export interface FeePayment {
    id: string;
    studentId: string;
    studentName: string;
    amount: number;
    month: string;
    year: number;
    date: Date;
    status: 'Paid' | 'Pending' | 'Overdue';
    type: 'Monthly Fee' | 'Exam Fee' | 'Registration Fee';
}

export interface ExamResult {
    id: string;
    studentId: string;
    studentName: string;
    examName: string;
    subject: string;
    marks: number;
    grade: string;
    rank?: number;
    date: Date;
}

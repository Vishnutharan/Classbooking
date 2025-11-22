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

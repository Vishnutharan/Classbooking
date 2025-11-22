/**
 * Teacher Student Management Models
 * Models for managing students enrolled with a teacher
 */

export interface TeacherStudent {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    profilePicture?: string;
    grade: string;
    subjects: string[];
    enrollmentDate: Date;
    status: 'Active' | 'Inactive' | 'Completed';
    parentName?: string;
    parentContact?: string;
    address?: string;
    performanceLevel: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
}

export interface StudentProgress {
    studentId: string;
    subject: string;
    overallGrade: number;
    attendanceRate: number;
    assignmentsCompleted: number;
    totalAssignments: number;
    averageScore: number;
    strengths: string[];
    weaknesses: string[];
    recentPerformance: PerformanceRecord[];
    lastUpdated: Date;
}

export interface PerformanceRecord {
    date: Date;
    type: 'Quiz' | 'Assignment' | 'Exam' | 'Participation';
    title: string;
    score: number;
    maxScore: number;
    percentage: number;
}

export interface StudentNote {
    id: string;
    studentId: string;
    teacherId: string;
    subject: string;
    noteType: 'Academic' | 'Behavioral' | 'Progress' | 'Communication';
    content: string;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface StudentEngagementMetrics {
    studentId: string;
    participationScore: number;
    questionAskedCount: number;
    assignmentSubmissionRate: number;
    classAttendanceRate: number;
    averageResponseTime: number; // in hours
    lastActiveDate: Date;
    engagementLevel: 'High' | 'Medium' | 'Low';
}

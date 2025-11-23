/**
 * Teacher Analytics Models
 * Models for performance metrics and analytics data
 */

export interface TeacherMetrics {
    teacherId: string;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: Date;
    endDate: Date;

    // Student Metrics
    totalStudents: number;
    activeStudents: number;
    newStudents: number;
    studentRetentionRate: number;

    // Class Metrics
    totalClasses: number;
    completedClasses: number;
    cancelledClasses: number;
    averageClassSize: number;

    // Performance Metrics
    averageRating: number;
    totalReviews: number;
    ratingsBreakdown: RatingBreakdown;

    // Engagement Metrics
    averageAttendance: number;
    studentEngagementScore: number;

    lastUpdated: Date;
}

export interface RatingBreakdown {
    fiveStars: number;
    fourStars: number;
    threeStars: number;
    twoStars: number;
    oneStar: number;
}

export interface EarningsAnalytics {
    teacherId: string;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    totalEarnings: number;
    projectedEarnings: number;
    earningsBySubject: SubjectEarnings[];
    earningsByClassType: ClassTypeEarnings[];
    earningsTrend: EarningsTrendData[];
    peakEarningHours: PeakHour[];
    averageHourlyRate: number;
    totalHoursTeaching: number;
}

export interface SubjectEarnings {
    subject: string;
    earnings: number;
    classCount: number;
    averageRate: number;
    percentage: number;
}

export interface ClassTypeEarnings {
    classType: 'Individual' | 'Group' | 'Online' | 'In-Person';
    earnings: number;
    classCount: number;
    percentage: number;
}

export interface EarningsTrendData {
    date: Date;
    earnings: number;
    classCount: number;
    studentCount: number;
}

export interface PeakHour {
    hour: number;
    dayOfWeek: string;
    classCount: number;
    earnings: number;
}

export interface StudentEngagement {
    studentId: string;
    studentName: string;
    subject: string;
    engagementScore: number;
    attendanceRate: number;
    participationScore: number;
    assignmentCompletion: number;
    averageScore: number;
    lastActivity: Date;
    status: 'Highly Engaged' | 'Engaged' | 'Moderately Engaged' | 'At Risk';
}

export interface SubjectPerformance {
    subject: string;
    totalStudents: number;
    averageScore: number;
    passRate: number;
    improvementRate: number;
    studentSatisfaction: number;
    classesCompleted: number;
    topPerformers: string[];
    needsAttention: string[];
}

export interface TeacherGoal {
    id: string;
    teacherId: string;
    goalType: 'Students' | 'Earnings' | 'Rating' | 'Classes' | 'Custom';
    title: string;
    targetValue: number;
    currentValue: number;
    deadline: Date;
    status: 'On Track' | 'Behind' | 'Achieved' | 'Missed';
    createdAt: Date;
}

export interface ComparisonMetrics {
    myMetric: number;
    averageMetric: number;
    topPerformersMetric: number;
    percentile: number;
}

export interface MonthlyReport {
    month: string;
    year: number;
    summary: TeacherMetrics;
    earnings: EarningsAnalytics;
    topPerformingSubject: string;
    achievements: string[];
    areasForImprovement: string[];
    generatedAt: Date;
}

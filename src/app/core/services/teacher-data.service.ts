import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DemoDataService } from './demo-data.service';

// Import all teacher feature models
import {
    AttendanceRecord,
    AttendanceSession,
    AttendanceStats,
    StudentAttendanceSummary,
    AttendanceStatus
} from '../models/teacher-attendance.models';

import {
    TeacherStudent,
    StudentProgress,
    StudentNote,
    StudentEngagementMetrics,
    PerformanceRecord
} from '../models/teacher-student-management.models';

import {
    LessonPlan,
    CurriculumTopic,
    LearningObjective,
    LessonResource,
    LessonActivity,
    AssessmentMethod
} from '../models/lesson-plan.models';

import {
    TeacherMetrics,
    EarningsAnalytics,
    StudentEngagement,
    SubjectPerformance,
    EarningsTrendData,
    SubjectEarnings
} from '../models/teacher-analytics.models';

import {
    TeacherMessage,
    Conversation,
    Announcement,
    MessageStats,
    ConversationParticipant
} from '../models/teacher-communication.models';

@Injectable({
    providedIn: 'root'
})
export class TeacherDataService {
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);
    private demoData = inject(DemoDataService);

    private KEYS = {
        ATTENDANCE: 'teacher_attendance',
        STUDENTS: 'teacher_students',
        LESSON_PLANS: 'teacher_lesson_plans',
        ANALYTICS: 'teacher_analytics',
        MESSAGES: 'teacher_messages',
        CONVERSATIONS: 'teacher_conversations',
        ANNOUNCEMENTS: 'teacher_announcements'
    };

    constructor() {
        if (this.isBrowser) {
            this.initTeacherData();
        }
    }

    private initTeacherData() {
        if (!localStorage.getItem(this.KEYS.ATTENDANCE)) {
            this.seedAttendanceData();
        }
        if (!localStorage.getItem(this.KEYS.STUDENTS)) {
            this.seedStudentsData();
        }
        if (!localStorage.getItem(this.KEYS.LESSON_PLANS)) {
            this.seedLessonPlans();
        }
        if (!localStorage.getItem(this.KEYS.MESSAGES)) {
            this.seedMessagesData();
        }
        if (!localStorage.getItem(this.KEYS.CONVERSATIONS)) {
            this.seedConversationsData();
        }
        if (!localStorage.getItem(this.KEYS.ANNOUNCEMENTS)) {
            this.seedAnnouncementsData();
        }
    }

    // --- ATTENDANCE DATA ---

    private seedAttendanceData() {
        const today = new Date();
        const attendanceRecords: AttendanceRecord[] = [];

        // Generate attendance records for the past 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            // Create records for 5-8 students per day
            const studentCount = 5 + Math.floor(Math.random() * 4);
            for (let j = 0; j < studentCount; j++) {
                const studentId = `student-${(j % 5) + 1}`;
                const statuses: AttendanceStatus[] = ['Present', 'Absent', 'Late', 'Excused'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];

                attendanceRecords.push({
                    id: `att-${i}-${j}`,
                    studentId,
                    studentName: this.getStudentName(studentId),
                    classId: `class-${i}`,
                    subject: this.getRandomSubject(),
                    date,
                    status,
                    notes: status === 'Absent' ? 'Informed in advance' : undefined,
                    markedBy: 'teacher-1',
                    markedAt: new Date(date.getTime() + 3600000) // 1 hour after class
                });
            }
        }

        this.setItem(this.KEYS.ATTENDANCE, attendanceRecords);
    }

    getAttendanceRecords(teacherId: string, startDate?: Date, endDate?: Date): Observable<AttendanceRecord[]> {
        let records = this.getItem<AttendanceRecord>(this.KEYS.ATTENDANCE);

        if (startDate) {
            records = records.filter(r => new Date(r.date) >= startDate);
        }
        if (endDate) {
            records = records.filter(r => new Date(r.date) <= endDate);
        }

        return of(records).pipe(delay(300));
    }

    markAttendance(records: AttendanceRecord[]): Observable<boolean> {
        const existingRecords = this.getItem<AttendanceRecord>(this.KEYS.ATTENDANCE);
        existingRecords.push(...records);
        this.setItem(this.KEYS.ATTENDANCE, existingRecords);
        return of(true).pipe(delay(300));
    }

    // --- STUDENT MANAGEMENT DATA ---

    private seedStudentsData() {
        const sriLankanNames = [
            'Nimal Perera', 'Kamal Silva', 'Dilini Rajapaksha', 'Saman Jayawardena',
            'Tharindu Fernando', 'Ishara de Silva', 'Kasun Wijesinghe', 'Nethmi Wickramasinghe',
            'Dinesh Gunawardena', 'Sanduni Amarasinghe', 'Chamod Dissanayake', 'Anusha Bandara'
        ];

        const students: TeacherStudent[] = sriLankanNames.map((name, i) => ({
            id: `tstudent-${i + 1}`,
            userId: `user-student-${i + 1}`,
            fullName: name,
            email: `${name.toLowerCase().replace(' ', '.')}@student.lk`,
            phoneNumber: `077${Math.floor(1000000 + Math.random() * 9000000)}`,
            profilePicture: undefined,
            grade: ['Grade 10', 'Grade 11', 'A/L 1st Year', 'A/L 2nd Year', 'O/L'][i % 5],
            subjects: this.getRandomSubjects(),
            enrollmentDate: new Date(2024, Math.floor(Math.random() * 6), 1),
            status: 'Active',
            parentName: `Parent of ${name}`,
            parentContact: `071${Math.floor(1000000 + Math.random() * 9000000)}`,
            performanceLevel: (['Excellent', 'Good', 'Average', 'Needs Improvement'] as const)[i % 4]
        }));

        this.setItem(this.KEYS.STUDENTS, students);
    }

    getTeacherStudents(teacherId: string): Observable<TeacherStudent[]> {
        const students = this.getItem<TeacherStudent>(this.KEYS.STUDENTS);
        return of(students).pipe(delay(300));
    }

    getStudentProgress(studentId: string): Observable<StudentProgress> {
        // Generate mock progress data
        const progress: StudentProgress = {
            studentId,
            subject: 'Mathematics',
            overallGrade: 70 + Math.random() * 30,
            attendanceRate: 75 + Math.random() * 25,
            assignmentsCompleted: Math.floor(15 + Math.random() * 10),
            totalAssignments: 25,
            averageScore: 65 + Math.random() * 30,
            strengths: ['Problem Solving', 'Analytical Thinking'],
            weaknesses: ['Time Management', 'Formula Application'],
            recentPerformance: this.generatePerformanceRecords(),
            lastUpdated: new Date()
        };

        return of(progress).pipe(delay(300));
    }

    private generatePerformanceRecords(): PerformanceRecord[] {
        const records: PerformanceRecord[] = [];
        const types: ('Quiz' | 'Assignment' | 'Exam' | 'Participation')[] = ['Quiz', 'Assignment', 'Exam', 'Participation'];

        for (let i = 0; i < 5; i++) {
            const maxScore = 100;
            const score = 50 + Math.random() * 50;
            records.push({
                date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
                type: types[i % types.length],
                title: `${types[i % types.length]} ${i + 1}`,
                score,
                maxScore,
                percentage: (score / maxScore) * 100
            });
        }

        return records;
    }

    // --- LESSON PLANNING DATA ---

    private seedLessonPlans() {
        const lessonPlans: LessonPlan[] = [
            {
                id: 'lp-1',
                teacherId: 'teacher-1',
                subject: 'Mathematics',
                grade: 'Grade 10',
                title: 'Introduction to Quadratic Equations',
                description: 'Students will learn about quadratic equations, their properties, and solving methods',
                curriculumTopic: {
                    id: 'ct-1',
                    subject: 'Mathematics',
                    grade: 'Grade 10',
                    unit: 'Unit 3',
                    topic: 'Quadratic Equations',
                    subtopics: ['Standard Form', 'Factoring', 'Quadratic Formula'],
                    syllabusSectionReference: 'Math-10-3.2'
                },
                learningObjectives: [
                    { id: 'lo-1', description: 'Identify quadratic equations in standard form', category: 'Knowledge' },
                    { id: 'lo-2', description: 'Solve quadratic equations using factoring method', category: 'Application' },
                    { id: 'lo-3', description: 'Apply quadratic formula to real-world problems', category: 'Application' }
                ],
                resources: [
                    { id: 'res-1', type: 'PDF', title: 'Quadratic Equations Worksheet', url: '#', description: 'Practice problems', uploadedAt: new Date() }
                ],
                activities: [
                    { id: 'act-1', title: 'Class Discussion', description: 'Discuss real-world applications', activityType: 'Discussion', duration: 15 },
                    { id: 'act-2', title: 'Practice Problems', description: 'Solve equations on whiteboard', activityType: 'Practice', duration: 30 }
                ],
                assessment: [
                    { id: 'asm-1', type: 'Quiz', description: 'End of lesson quiz', criteria: ['Accuracy', 'Speed'], totalMarks: 20 }
                ],
                duration: 60,
                scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                status: 'Planned',
                tags: ['Algebra', 'Problem Solving'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'lp-2',
                teacherId: 'teacher-1',
                subject: 'Mathematics',
                grade: 'A/L',
                title: 'Calculus: Differentiation Basics',
                description: 'Introduction to derivatives and differentiation rules',
                curriculumTopic: {
                    id: 'ct-2',
                    subject: 'Mathematics',
                    grade: 'A/L',
                    unit: 'Unit 1',
                    topic: 'Differential Calculus',
                    subtopics: ['Limits', 'Derivatives', 'Rules of Differentiation'],
                    syllabusSectionReference: 'Math-AL-1.1'
                },
                learningObjectives: [
                    { id: 'lo-4', description: 'Understand the concept of limits', category: 'Comprehension' },
                    { id: 'lo-5', description: 'Calculate derivatives using basic rules', category: 'Application' }
                ],
                resources: [],
                activities: [],
                assessment: [],
                duration: 90,
                status: 'Draft',
                tags: ['Calculus', 'A/L'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'lp-3',
                teacherId: 'teacher-1',
                subject: 'Mathematics',
                grade: 'Grade 11',
                title: 'Trigonometry: Sin, Cos, Tan',
                description: 'Basic trigonometric ratios and their applications',
                curriculumTopic: {
                    id: 'ct-3',
                    subject: 'Mathematics',
                    grade: 'Grade 11',
                    unit: 'Unit 5',
                    topic: 'Trigonometry',
                    subtopics: ['Right Triangle Trig', 'Unit Circle', 'Trig Identities'],
                    syllabusSectionReference: 'Math-11-5.1'
                },
                learningObjectives: [
                    { id: 'lo-6', description: 'Define sin, cos, and tan ratios', category: 'Knowledge' },
                    { id: 'lo-7', description: 'Solve right triangle problems', category: 'Application' }
                ],
                resources: [
                    { id: 'res-2', type: 'Video', title: 'Trigonometry Explained', url: 'https://youtube.com/watch?v=example', uploadedAt: new Date() }
                ],
                activities: [
                    { id: 'act-3', title: 'Triangle Measurement', description: 'Measure and calculate angles', activityType: 'Practice', duration: 20 }
                ],
                assessment: [
                    { id: 'asm-2', type: 'Assignment', description: 'Homework problems', criteria: ['Accuracy'], totalMarks: 25 }
                ],
                duration: 60,
                scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                status: 'Planned',
                tags: ['Trigonometry'],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        this.setItem(this.KEYS.LESSON_PLANS, lessonPlans);
    }

    getLessonPlans(teacherId: string): Observable<LessonPlan[]> {
        const plans = this.getItem<LessonPlan>(this.KEYS.LESSON_PLANS);
        return of(plans.filter(p => p.teacherId === teacherId)).pipe(delay(300));
    }

    saveLessonPlan(plan: LessonPlan): Observable<LessonPlan> {
        const plans = this.getItem<LessonPlan>(this.KEYS.LESSON_PLANS);
        const index = plans.findIndex(p => p.id === plan.id);

        if (index >= 0) {
            plans[index] = plan;
        } else {
            plans.push(plan);
        }

        this.setItem(this.KEYS.LESSON_PLANS, plans);
        return of(plan).pipe(delay(300));
    }

    deleteLessonPlan(planId: string): Observable<boolean> {
        const plans = this.getItem<LessonPlan>(this.KEYS.LESSON_PLANS);
        const filtered = plans.filter(p => p.id !== planId);
        this.setItem(this.KEYS.LESSON_PLANS, filtered);
        return of(true).pipe(delay(300));
    }

    // --- ANALYTICS DATA ---

    getTeacherAnalytics(teacherId: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Observable<TeacherMetrics> {
        const metrics: TeacherMetrics = {
            teacherId,
            period,
            startDate: new Date(2024, 0, 1),
            endDate: new Date(),
            totalStudents: 12,
            activeStudents: 10,
            newStudents: 3,
            studentRetentionRate: 85,
            totalClasses: 45,
            completedClasses: 42,
            cancelledClasses: 3,
            averageClassSize: 4.2,
            averageRating: 4.7,
            totalReviews: 28,
            ratingsBreakdown: {
                fiveStars: 15,
                fourStars: 10,
                threeStars: 2,
                twoStars: 1,
                oneStar: 0
            },
            averageAttendance: 88,
            studentEngagementScore: 82,
            lastUpdated: new Date()
        };

        return of(metrics).pipe(delay(300));
    }

    getEarningsAnalytics(teacherId: string, period: 'monthly' | 'yearly'): Observable<EarningsAnalytics> {
        const subjects: SubjectEarnings[] = [
            { subject: 'Mathematics', earnings: 45000, classCount: 30, averageRate: 1500, percentage: 60 },
            { subject: 'Physics', earnings: 20000, classCount: 10, averageRate: 2000, percentage: 26.7 },
            { subject: 'Chemistry', earnings: 10000, classCount: 5, averageRate: 2000, percentage: 13.3 }
        ];

        const trendData: EarningsTrendData[] = [];
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            trendData.push({
                date,
                earnings: 20000 + Math.random() * 30000,
                classCount: 10 + Math.floor(Math.random() * 20),
                studentCount: 5 + Math.floor(Math.random() * 10)
            });
        }

        const analytics: EarningsAnalytics = {
            teacherId,
            period,
            totalEarnings: 75000,
            projectedEarnings: 80000,
            earningsBySubject: subjects,
            earningsByClassType: [
                { classType: 'Individual', earnings: 50000, classCount: 35, percentage: 66.7 },
                { classType: 'Group', earnings: 25000, classCount: 10, percentage: 33.3 },
                { classType: 'Online', earnings: 40000, classCount: 25, percentage: 53.3 },
                { classType: 'In-Person', earnings: 35000, classCount: 20, percentage: 46.7 }
            ],
            earningsTrend: trendData,
            peakEarningHours: [
                { hour: 16, dayOfWeek: 'Saturday', classCount: 12, earnings: 18000 },
                { hour: 17, dayOfWeek: 'Sunday', classCount: 10, earnings: 15000 }
            ],
            averageHourlyRate: 1667,
            totalHoursTeaching: 45
        };

        return of(analytics).pipe(delay(300));
    }

    getSubjectPerformance(teacherId: string): Observable<SubjectPerformance[]> {
        const performance: SubjectPerformance[] = [
            {
                subject: 'Mathematics',
                totalStudents: 8,
                averageScore: 75,
                passRate: 87.5,
                improvementRate: 15,
                studentSatisfaction: 4.6,
                classesCompleted: 30,
                topPerformers: ['student-1', 'student-3'],
                needsAttention: ['student-5']
            },
            {
                subject: 'Physics',
                totalStudents: 4,
                averageScore: 68,
                passRate: 75,
                improvementRate: 20,
                studentSatisfaction: 4.8,
                classesCompleted: 10,
                topPerformers: ['student-2'],
                needsAttention: ['student-4']
            }
        ];

        return of(performance).pipe(delay(300));
    }

    // --- COMMUNICATION DATA ---

    private seedMessagesData() {
        const messages: TeacherMessage[] = [
            {
                id: 'msg-1',
                conversationId: 'conv-1',
                senderId: 'student-1',
                senderName: 'Alice Fernando',
                senderRole: 'Student',
                recipientId: 'teacher-1',
                recipientName: 'Mr. Bob Fernando',
                subject: 'Question about homework',
                content: 'Sir, I have difficulty understanding question 5 from yesterday\'s homework. Can you please explain?',
                attachments: [],
                isRead: false,
                sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                priority: 'Normal'
            },
            {
                id: 'msg-2',
                conversationId: 'conv-2',
                senderId: 'student-2',
                senderName: 'Kamal Silva',
                senderRole: 'Student',
                recipientId: 'teacher-1',
                recipientName: 'Mr. Bob Fernando',
                subject: 'Class reschedule request',
                content: 'Sir, can we reschedule tomorrow\'s class? I have a family event.',
                attachments: [],
                isRead: true,
                readAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
                sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                priority: 'High'
            }
        ];

        this.setItem(this.KEYS.MESSAGES, messages);
    }

    private seedConversationsData() {
        const conversations: Conversation[] = [
            {
                id: 'conv-1',
                participants: [
                    { userId: 'teacher-1', name: 'Mr. Bob Fernando', role: 'Teacher' },
                    { userId: 'student-1', name: 'Alice Fernando', role: 'Student' }
                ],
                subject: 'Question about homework',
                lastMessage: {
                    id: 'msg-1',
                    conversationId: 'conv-1',
                    senderId: 'student-1',
                    senderName: 'Alice Fernando',
                    senderRole: 'Student',
                    recipientId: 'teacher-1',
                    recipientName: 'Mr. Bob Fernando',
                    subject: 'Question about homework',
                    content: 'Sir, I have difficulty understanding question 5',
                    attachments: [],
                    isRead: false,
                    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    priority: 'Normal'
                },
                unreadCount: 1,
                messages: [],
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                status: 'Active'
            }
        ];

        this.setItem(this.KEYS.CONVERSATIONS, conversations);
    }

    private seedAnnouncementsData() {
        const announcements: Announcement[] = [
            {
                id: 'ann-1',
                teacherId: 'teacher-1',
                teacherName: 'Mr. Bob Fernando',
                title: 'Class Schedule Update',
                content: 'Dear students, please note that next week\'s classes will start 30 minutes earlier due to public holiday on Monday.',
                recipientType: 'All Students',
                recipients: [],
                attachments: [],
                isPinned: true,
                sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                viewCount: 8,
                viewedBy: ['student-1', 'student-2', 'student-3']
            }
        ];

        this.setItem(this.KEYS.ANNOUNCEMENTS, announcements);
    }

    getConversations(teacherId: string): Observable<Conversation[]> {
        const conversations = this.getItem<Conversation>(this.KEYS.CONVERSATIONS);
        return of(conversations).pipe(delay(300));
    }

    getAnnouncements(teacherId: string): Observable<Announcement[]> {
        const announcements = this.getItem<Announcement>(this.KEYS.ANNOUNCEMENTS);
        return of(announcements.filter(a => a.teacherId === teacherId)).pipe(delay(300));
    }

    sendMessage(message: TeacherMessage): Observable<boolean> {
        const messages = this.getItem<TeacherMessage>(this.KEYS.MESSAGES);
        messages.push(message);
        this.setItem(this.KEYS.MESSAGES, messages);
        return of(true).pipe(delay(300));
    }

    createAnnouncement(announcement: Announcement): Observable<Announcement> {
        const announcements = this.getItem<Announcement>(this.KEYS.ANNOUNCEMENTS);
        announcements.push(announcement);
        this.setItem(this.KEYS.ANNOUNCEMENTS, announcements);
        return of(announcement).pipe(delay(300));
    }

    // --- HELPER METHODS ---

    private getItem<T>(key: string): T[] {
        if (!this.isBrowser) return [];
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    private setItem<T>(key: string, data: T[]) {
        if (this.isBrowser) {
            localStorage.setItem(key, JSON.stringify(data));
        }
    }

    private getStudentName(studentId: string): string {
        const names: { [key: string]: string } = {
            'student-1': 'Alice Fernando',
            'student-2': 'Kamal Silva',
            'student-3': 'Nimal Perera',
            'student-4': 'Saman Jayawardena',
            'student-5': 'Dilini Rajapaksha'
        };
        return names[studentId] || 'Unknown Student';
    }

    private getRandomSubject(): string {
        const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
        return subjects[Math.floor(Math.random() * subjects.length)];
    }

    private getRandomSubjects(): string[] {
        const allSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
        const count = 1 + Math.floor(Math.random() * 3);
        const shuffled = allSubjects.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}

import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
    User, TeacherProfile, StudentProfile, ClassBooking,
    Resource, ExamPreparation, PublicHoliday, ExamSeason, SystemSettings
} from '../models/shared.models';

@Injectable({
    providedIn: 'root'
})
export class DemoDataService {
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);

    private KEYS = {
        USERS: 'demo_users',
        TEACHERS: 'demo_teachers',
        STUDENTS: 'demo_students',
        BOOKINGS: 'demo_bookings',
        RESOURCES: 'demo_resources',
        EXAM_PREP: 'demo_exam_prep',
        SETTINGS: 'demo_settings'
    };

    constructor() {
        if (this.isBrowser) {
            this.initData();
        }
    }

    private initData() {
        if (!localStorage.getItem(this.KEYS.USERS)) {
            this.seedUsers();
        }
        if (!localStorage.getItem(this.KEYS.TEACHERS)) {
            this.seedTeachers();
        }
        if (!localStorage.getItem(this.KEYS.STUDENTS)) {
            this.seedStudents();
        }
        if (!localStorage.getItem(this.KEYS.BOOKINGS)) {
            this.seedBookings();
        }
        if (!localStorage.getItem(this.KEYS.EXAM_PREP)) {
            this.seedExamPreparation();
        }
        if (!localStorage.getItem(this.KEYS.SETTINGS)) {
            this.seedSettings();
        }
    }

    // --- SEEDING METHODS ---

    private seedUsers() {
        const users: User[] = [
            // Students
            { id: 'student-1', email: 'student@test.com', password: 'Student@123', fullName: 'Alice Fernando', role: 'Student', profilePicture: 'assets/student-avatar.png', status: 'Active', createdAt: new Date() },
            { id: 'student-2', email: 'student2@test.com', password: 'Student@123', fullName: 'Kamal Silva', role: 'Student', status: 'Active', createdAt: new Date() },
            { id: 'student-3', email: 'student3@test.com', password: 'Student@123', fullName: 'Nimal Perera', role: 'Student', status: 'Active', createdAt: new Date() },
            { id: 'student-4', email: 'student4@test.com', password: 'Student@123', fullName: 'Saman Jayawardena', role: 'Student', status: 'Active', createdAt: new Date() },
            { id: 'student-5', email: 'student5@test.com', password: 'Student@123', fullName: 'Dilini Rajapaksha', role: 'Student', status: 'Active', createdAt: new Date() },
            // Teachers
            { id: 'teacher-1', email: 'teacher@test.com', password: 'Teacher@123', fullName: 'Mr. Bob Fernando', role: 'Teacher', profilePicture: 'assets/teacher-avatar.png', status: 'Active', createdAt: new Date() },
            { id: 'teacher-2', email: 'teacher2@test.com', password: 'Teacher@123', fullName: 'Mrs. Sarah Silva', role: 'Teacher', status: 'Active', createdAt: new Date() },
            { id: 'teacher-3', email: 'teacher3@test.com', password: 'Teacher@123', fullName: 'Dr. Rohan Perera', role: 'Teacher', status: 'Active', createdAt: new Date() },
            { id: 'teacher-4', email: 'teacher4@test.com', password: 'Teacher@123', fullName: 'Ms. Kumari De Silva', role: 'Teacher', status: 'Active', createdAt: new Date() },
            // Admin
            { id: 'admin-1', email: 'admin@test.com', password: 'Admin@123', fullName: 'Charlie Admin', role: 'Admin', status: 'Active', createdAt: new Date() }
        ];
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    }

    private seedTeachers() {
        const teachers: TeacherProfile[] = [
            {
                id: 'teacher-1', userId: 'teacher-1', fullName: 'Mr. Bob Fernando', email: 'teacher@test.com', phoneNumber: '0771234567',
                profilePicture: 'assets/teacher-avatar.png', bio: 'Expert in Mathematics with 10 years of experience. Specialized in O/L and A/L preparation.',
                qualifications: ['BSc Mathematics', 'PGDE'], subjects: [{ id: 's1', name: 'Mathematics', medium: 'English', level: 'OLevel' }, { id: 's2', name: 'Mathematics', medium: 'English', level: 'ALevel' }],
                hourlyRate: 1500, experienceYears: 10, averageRating: 4.8, totalReviews: 25, totalClasses: 150, isAvailable: true,
                availability: [{ dayOfWeek: 'Monday', startTime: '16:00', endTime: '20:00' }, { dayOfWeek: 'Wednesday', startTime: '16:00', endTime: '20:00' }, { dayOfWeek: 'Saturday', startTime: '09:00', endTime: '17:00' }],
                verificationStatus: 'Verified', createdAt: new Date(), updatedAt: new Date()
            },
            {
                id: 'teacher-2', userId: 'teacher-2', fullName: 'Mrs. Sarah Silva', email: 'teacher2@test.com', phoneNumber: '0772345678',
                profilePicture: 'assets/teacher-avatar.png', bio: 'Science specialist with focus on Biology and Chemistry.',
                qualifications: ['BSc Biology', 'MSc Biochemistry'], subjects: [{ id: 's3', name: 'Science', medium: 'English', level: 'OLevel' }, { id: 's4', name: 'Biology', medium: 'English', level: 'ALevel' }],
                hourlyRate: 1800, experienceYears: 8, averageRating: 4.9, totalReviews: 30, totalClasses: 120, isAvailable: true,
                availability: [{ dayOfWeek: 'Tuesday', startTime: '15:00', endTime: '19:00' }, { dayOfWeek: 'Thursday', startTime: '15:00', endTime: '19:00' }],
                verificationStatus: 'Verified', createdAt: new Date(), updatedAt: new Date()
            },
            {
                id: 'teacher-3', userId: 'teacher-3', fullName: 'Dr. Rohan Perera', email: 'teacher3@test.com', phoneNumber: '0773456789',
                profilePicture: 'assets/teacher-avatar.png', bio: 'Physics and Combined Mathematics expert with PhD.',
                qualifications: ['BSc Physics', 'PhD Physics'], subjects: [{ id: 's5', name: 'Physics', medium: 'English', level: 'ALevel' }, { id: 's6', name: 'Combined Mathematics', medium: 'English', level: 'ALevel' }],
                hourlyRate: 2000, experienceYears: 12, averageRating: 4.7, totalReviews: 18, totalClasses: 90, isAvailable: true,
                availability: [{ dayOfWeek: 'Friday', startTime: '16:00', endTime: '20:00' }, { dayOfWeek: 'Sunday', startTime: '10:00', endTime: '16:00' }],
                verificationStatus: 'Verified', createdAt: new Date(), updatedAt: new Date()
            },
            {
                id: 'teacher-4', userId: 'teacher-4', fullName: 'Ms. Kumari De Silva', email: 'teacher4@test.com', phoneNumber: '0774567890',
                profilePicture: 'assets/teacher-avatar.png', bio: 'English Language and Literature specialist.',
                qualifications: ['BA English', 'MA Literature'], subjects: [{ id: 's7', name: 'English', medium: 'English', level: 'OLevel' }, { id: 's8', name: 'English', medium: 'English', level: 'ALevel' }],
                hourlyRate: 1400, experienceYears: 7, averageRating: 4.6, totalReviews: 22, totalClasses: 110, isAvailable: true,
                availability: [{ dayOfWeek: 'Monday', startTime: '17:00', endTime: '20:00' }, { dayOfWeek: 'Wednesday', startTime: '17:00', endTime: '20:00' }],
                verificationStatus: 'Verified', createdAt: new Date(), updatedAt: new Date()
            }
        ];
        localStorage.setItem(this.KEYS.TEACHERS, JSON.stringify(teachers));
    }

    private seedStudents() {
        const students: StudentProfile[] = [
            {
                id: 'student-1', userId: 'student-1', fullName: 'Alice Fernando', email: 'student@test.com', phoneNumber: '0719876543', profilePicture: 'assets/student-avatar.png',
                gradeLevel: 'OLevel', school: 'Colombo International School', focusAreas: ['Mathematics', 'Science'], targetExams: ['O/L 2025'], createdAt: new Date(), updatedAt: new Date()
            },
            {
                id: 'student-2', userId: 'student-2', fullName: 'Kamal Silva', email: 'student2@test.com', phoneNumber: '0719876544', gradeLevel: 'ALevel', school: 'Royal College',
                focusAreas: ['Physics', 'Combined Mathematics'], targetExams: ['A/L 2024'], createdAt: new Date(), updatedAt: new Date()
            },
            {
                id: 'student-3', userId: 'student-3', fullName: 'Nimal Perera', email: 'student3@test.com', phoneNumber: '0719876545', gradeLevel: 'OLevel', school: 'Ananda College',
                focusAreas: ['English', 'History'], targetExams: ['O/L 2026'], createdAt: new Date(), updatedAt: new Date()
            },
            {
                id: 'student-4', userId: 'student-4', fullName: 'Saman Jayawardena', email: 'student4@test.com', phoneNumber: '0719876546', gradeLevel: 'Primary', school: 'Gateway College',
                focusAreas: ['Mathematics', 'English'], targetExams: ['Scholarship 2024'], createdAt: new Date(), updatedAt: new Date()
            },
            {
                id: 'student-5', userId: 'student-5', fullName: 'Dilini Rajapaksha', email: 'student5@test.com', phoneNumber: '0719876547', gradeLevel: 'ALevel', school: 'Ladies College',
                focusAreas: ['Biology', 'Chemistry'], targetExams: ['A/L 2025'], createdAt: new Date(), updatedAt: new Date()
            }
        ];
        localStorage.setItem(this.KEYS.STUDENTS, JSON.stringify(students));
    }

    private seedBookings() {
        const today = new Date();
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
        const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7);

        const bookings: ClassBooking[] = [
            // Confirmed upcoming bookings
            {
                id: 'bk-1', studentId: 'student-1', teacherId: 'teacher-1', subject: 'Mathematics', date: tomorrow, startTime: '16:00', endTime: '17:00',
                status: 'Confirmed', classType: 'OneTime', meetingLink: 'https://meet.google.com/abc-123', createdAt: new Date(), updatedAt: new Date()
            },
            {
                id: 'bk-2', studentId: 'student-2', teacherId: 'teacher-3', subject: 'Physics', date: nextWeek, startTime: '16:00', endTime: '17:30',
                status: 'Confirmed', classType: 'OneTime', meetingLink: 'https://meet.google.com/def-456', createdAt: new Date(), updatedAt: new Date()
            },
            {
                id: 'bk-3', studentId: 'student-3', teacherId: 'teacher-4', subject: 'English', date: tomorrow, startTime: '17:00', endTime: '18:00',
                status: 'Confirmed', classType: 'Recurring', meetingLink: 'https://meet.google.com/ghi-789', createdAt: new Date(), updatedAt: new Date()
            },
            // Pending bookings
            {
                id: 'bk-4', studentId: 'student-4', teacherId: 'teacher-1', subject: 'Mathematics', date: nextWeek, startTime: '10:00', endTime: '11:00',
                status: 'Pending', classType: 'OneTime', createdAt: new Date(), updatedAt: new Date()
            },
            // Completed bookings
            {
                id: 'bk-5', studentId: 'student-1', teacherId: 'teacher-2', subject: 'Science', date: lastWeek, startTime: '15:00', endTime: '16:00',
                status: 'Completed', classType: 'OneTime', notes: 'Covered photosynthesis topic', createdAt: new Date(), updatedAt: new Date()
            },
            {
                id: 'bk-6', studentId: 'student-2', teacherId: 'teacher-3', subject: 'Combined Mathematics', date: lastWeek, startTime: '11:00', endTime: '12:30',
                status: 'Completed', classType: 'OneTime', notes: 'Calculus practice', createdAt: new Date(), updatedAt: new Date()
            }
        ];
        localStorage.setItem(this.KEYS.BOOKINGS, JSON.stringify(bookings));
    }

    private seedExamPreparation() {
        const examPreparations: ExamPreparation[] = [
            // O-Level Resources
            {
                id: 'exam-olevel-1', examType: 'OLevel', subject: 'Mathematics',
                description: 'Comprehensive O-Level Mathematics preparation materials',
                resources: [
                    { id: 'res-1', title: 'O/L Mathematics 2023 Past Paper', type: 'PastPaper', url: '#', description: 'Paper I & II - English Medium', uploadedAt: new Date('2023-12-01'), uploadedBy: 'admin-1' },
                    { id: 'res-2', title: 'O/L Mathematics 2022 Past Paper', type: 'PastPaper', url: '#', description: 'Paper I & II', uploadedAt: new Date('2023-01-15'), uploadedBy: 'admin-1' },
                    { id: 'res-3', title: 'Algebra Complete Guide', type: 'PDF', url: '#', description: 'Comprehensive algebra notes', uploadedAt: new Date('2024-01-10'), uploadedBy: 'teacher-1' },
                    { id: 'res-4', title: 'Geometry Video Tutorials', type: 'Video', url: '#', description: '15-part video series', uploadedAt: new Date('2024-02-05'), uploadedBy: 'teacher-1' }
                ]
            },
            {
                id: 'exam-olevel-2', examType: 'OLevel', subject: 'Science',
                description: 'O-Level Science exam preparation',
                resources: [
                    { id: 'res-5', title: 'O/L Science 2023 Past Paper', type: 'PastPaper', url: '#', description: 'All sections', uploadedAt: new Date('2023-12-01'), uploadedBy: 'admin-1' },
                    { id: 'res-6', title: 'O/L Science 2022 Past Paper', type: 'PastPaper', url: '#', description: 'All sections', uploadedAt: new Date('2023-01-15'), uploadedBy: 'admin-1' },
                    { id: 'res-7', title: 'Biology Notes - Plants', type: 'PDF', url: '#', description: 'Complete plant biology notes', uploadedAt: new Date('2024-01-20'), uploadedBy: 'teacher-2' }
                ]
            },
            {
                id: 'exam-olevel-3', examType: 'OLevel', subject: 'English',
                description: 'O-Level English preparation materials',
                resources: [
                    { id: 'res-8', title: 'O/L English 2023 Past Paper', type: 'PastPaper', url: '#', description: 'Paper I & II', uploadedAt: new Date('2023-12-01'), uploadedBy: 'admin-1' },
                    { id: 'res-9', title: 'O/L English 2022 Past Paper', type: 'PastPaper', url: '#', description: 'Paper I & II', uploadedAt: new Date('2023-01-15'), uploadedBy: 'admin-1' },
                    { id: 'res-10', title: 'Essay Writing Techniques', type: 'PDF', url: '#', description: 'Effective essay guide', uploadedAt: new Date('2024-01-05'), uploadedBy: 'teacher-4' }
                ]
            },
            // A-Level Resources
            {
                id: 'exam-alevel-1', examType: 'ALevel', subject: 'Combined Mathematics',
                description: 'A-Level Combined Mathematics resources',
                resources: [
                    { id: 'res-11', title: 'A/L Combined Maths 2023 Past Paper', type: 'PastPaper', url: '#', description: 'Paper I & II', uploadedAt: new Date('2023-12-01'), uploadedBy: 'admin-1' },
                    { id: 'res-12', title: 'A/L Combined Maths 2022 Past Paper', type: 'PastPaper', url: '#', description: 'Paper I & II', uploadedAt: new Date('2023-01-15'), uploadedBy: 'admin-1' },
                    { id: 'res-13', title: 'Calculus Mastery Course', type: 'Video', url: '#', description: '20-hour video course', uploadedAt: new Date('2024-01-15'), uploadedBy: 'teacher-3' }
                ]
            },
            {
                id: 'exam-alevel-2', examType: 'ALevel', subject: 'Physics',
                description: 'A-Level Physics exam preparation',
                resources: [
                    { id: 'res-14', title: 'A/L Physics 2023 Past Paper', type: 'PastPaper', url: '#', description: 'Paper I, II & III', uploadedAt: new Date('2023-12-01'), uploadedBy: 'admin-1' },
                    { id: 'res-15', title: 'A/L Physics 2022 Past Paper', type: 'PastPaper', url: '#', description: 'Paper I, II & III', uploadedAt: new Date('2023-01-15'), uploadedBy: 'admin-1' },
                    { id: 'res-16', title: 'Quantum Mechanics Explained', type: 'Video', url: '#', description: 'Video series on quantum physics', uploadedAt: new Date('2024-01-25'), uploadedBy: 'teacher-3' }
                ]
            },
            {
                id: 'exam-alevel-3', examType: 'ALevel', subject: 'Biology',
                description: 'A-Level Biology preparation',
                resources: [
                    { id: 'res-17', title: 'A/L Biology 2023 Past Paper', type: 'PastPaper', url: '#', description: 'Paper I, II & III', uploadedAt: new Date('2023-12-01'), uploadedBy: 'admin-1' },
                    { id: 'res-18', title: 'A/L Biology 2022 Past Paper', type: 'PastPaper', url: '#', description: 'Paper I, II & III', uploadedAt: new Date('2023-01-15'), uploadedBy: 'admin-1' }
                ]
            },
            // Scholarship Resources
            {
                id: 'exam-scholarship-1', examType: 'Scholarship', subject: 'General',
                description: 'Grade 5 Scholarship exam preparation',
                resources: [
                    { id: 'res-19', title: 'Scholarship 2023 Past Paper', type: 'PastPaper', url: '#', description: 'Complete paper with answers', uploadedAt: new Date('2023-12-01'), uploadedBy: 'admin-1' },
                    { id: 'res-20', title: 'Scholarship 2022 Past Paper', type: 'PastPaper', url: '#', description: 'Complete paper with answers', uploadedAt: new Date('2023-01-15'), uploadedBy: 'admin-1' },
                    { id: 'res-21', title: 'Mental Ability Practice', type: 'Quiz', url: '#', description: '50 mental ability questions', uploadedAt: new Date('2024-01-10'), uploadedBy: 'teacher-1' }
                ]
            }
        ];
        localStorage.setItem(this.KEYS.EXAM_PREP, JSON.stringify(examPreparations));
    }

    private seedSettings() {
        const settings: SystemSettings = {
            id: 'sys-1', platformName: 'ClassBooking', platformEmail: 'support@classbooking.com',
            defaultHourlyRate: 1000, maxClassDurationMinutes: 120, minClassDurationMinutes: 30,
            cancellationDeadlineHours: 24, platformCommissionPercentage: 10
        };
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    }

    // --- GENERIC GET/SET HELPERS ---

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

    // --- PUBLIC API ---

    // Users
    getUsers(): User[] { return this.getItem<User>(this.KEYS.USERS); }
    getUserByEmail(email: string): User | undefined {
        return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    }
    addUser(user: User) {
        const users = this.getUsers();
        users.push(user);
        this.setItem(this.KEYS.USERS, users);
    }
    updateUser(user: User) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
            this.setItem(this.KEYS.USERS, users);
        }
    }

    // Teachers
    getTeachers(): TeacherProfile[] { return this.getItem<TeacherProfile>(this.KEYS.TEACHERS); }
    getTeacherById(id: string): TeacherProfile | undefined {
        return this.getTeachers().find(t => t.id === id);
    }
    updateTeacher(teacher: TeacherProfile) {
        const teachers = this.getTeachers();
        const index = teachers.findIndex(t => t.id === teacher.id);
        if (index !== -1) {
            teachers[index] = teacher;
            this.setItem(this.KEYS.TEACHERS, teachers);
        }
    }

    // Students
    getStudents(): StudentProfile[] { return this.getItem<StudentProfile>(this.KEYS.STUDENTS); }
    getStudentById(id: string): StudentProfile | undefined {
        return this.getStudents().find(s => s.id === id);
    }
    getStudentByUserId(userId: string): StudentProfile | undefined {
        return this.getStudents().find(s => s.userId === userId);
    }
    updateStudent(student: StudentProfile) {
        const students = this.getStudents();
        const index = students.findIndex(s => s.id === student.id);
        if (index !== -1) {
            students[index] = student;
            this.setItem(this.KEYS.STUDENTS, students);
        }
    }

    // Bookings
    getBookings(): ClassBooking[] {
        const bookings = this.getItem<ClassBooking>(this.KEYS.BOOKINGS);
        // Restore Date objects
        return bookings.map(b => ({
            ...b,
            date: new Date(b.date),
            createdAt: new Date(b.createdAt),
            updatedAt: new Date(b.updatedAt)
        }));
    }
    addBooking(booking: ClassBooking) {
        const bookings = this.getBookings();
        bookings.push(booking);
        this.setItem(this.KEYS.BOOKINGS, bookings);
    }
    updateBooking(booking: ClassBooking) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(b => b.id === booking.id);
        if (index !== -1) {
            bookings[index] = booking;
            this.setItem(this.KEYS.BOOKINGS, bookings);
        }
    }

    // Exam Preparations
    getExamPreparations(): ExamPreparation[] {
        const preps = this.getItem<ExamPreparation>(this.KEYS.EXAM_PREP);
        return preps;
    }

    // Settings
    getSettings(): SystemSettings {
        const settings = localStorage.getItem(this.KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : {} as SystemSettings;
    }
}

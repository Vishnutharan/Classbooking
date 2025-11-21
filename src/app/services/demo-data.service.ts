import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'Student' | 'Teacher' | 'Admin';
    password?: string; // For demo login check
    profilePicture?: string;
    bio?: string;
    subjects?: string[];
}

export interface ClassSession {
    id: string;
    title: string;
    teacherId: string;
    studentId?: string; // If booked
    start: string; // ISO string
    end: string; // ISO string
    status: 'available' | 'booked' | 'completed' | 'cancelled';
    description?: string;
    meetingLink?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DemoDataService {
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);

    private USERS_KEY = 'demo_users';
    private CLASSES_KEY = 'demo_classes';

    constructor() {
        if (this.isBrowser) {
            this.initData();
        }
    }

    private initData() {
        if (!localStorage.getItem(this.USERS_KEY)) {
            const users: User[] = [
                {
                    id: 'student-1',
                    email: 'student@test.com',
                    password: 'Student@123',
                    fullName: 'Alice Student',
                    role: 'Student',
                    profilePicture: 'assets/student-avatar.png'
                },
                {
                    id: 'student-2',
                    email: 'john@test.com',
                    password: 'Student@123',
                    fullName: 'John Doe',
                    role: 'Student',
                    profilePicture: 'https://i.pravatar.cc/150?u=student2'
                },
                {
                    id: 'student-3',
                    email: 'emma@test.com',
                    password: 'Student@123',
                    fullName: 'Emma Wilson',
                    role: 'Student',
                    profilePicture: 'https://i.pravatar.cc/150?u=student3'
                },
                {
                    id: 'teacher-1',
                    email: 'teacher@test.com',
                    password: 'Teacher@123',
                    fullName: 'Bob Teacher',
                    role: 'Teacher',
                    bio: 'Expert in Mathematics and Physics with 10 years of experience.',
                    subjects: ['Math', 'Physics'],
                    profilePicture: 'assets/teacher-avatar.png'
                },
                {
                    id: 'teacher-2',
                    email: 'sarah@test.com',
                    password: 'Teacher@123',
                    fullName: 'Sarah Smith',
                    role: 'Teacher',
                    bio: 'Certified English and Literature teacher.',
                    subjects: ['English', 'Literature'],
                    profilePicture: 'https://i.pravatar.cc/150?u=teacher2'
                },
                {
                    id: 'teacher-3',
                    email: 'david@test.com',
                    password: 'Teacher@123',
                    fullName: 'David Brown',
                    role: 'Teacher',
                    bio: 'Chemistry wizard and Science enthusiast.',
                    subjects: ['Chemistry', 'Science'],
                    profilePicture: 'https://i.pravatar.cc/150?u=teacher3'
                },
                {
                    id: 'admin-1',
                    email: 'admin@test.com',
                    password: 'Admin@123',
                    fullName: 'Charlie Admin',
                    role: 'Admin'
                }
            ];
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        }

        if (!localStorage.getItem(this.CLASSES_KEY)) {
            const classes: ClassSession[] = [];
            const today = new Date();

            // Helper to add days
            const addDays = (date: Date, days: number) => {
                const result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            };

            // Past classes (Completed)
            for (let i = 1; i <= 5; i++) {
                const date = addDays(today, -i);
                const dateStr = date.toISOString().split('T')[0];
                classes.push({
                    id: `past-${i}`,
                    title: 'Math Session',
                    teacherId: 'teacher-1',
                    studentId: 'student-1',
                    start: `${dateStr}T10:00:00`,
                    end: `${dateStr}T11:00:00`,
                    status: 'completed',
                    description: 'Covered algebra basics.'
                });
            }

            // Future classes (Booked & Available) for Teacher 1
            for (let i = 0; i < 7; i++) {
                const date = addDays(today, i);
                const dateStr = date.toISOString().split('T')[0];

                // Booked slot
                if (i % 2 === 0) {
                    classes.push({
                        id: `future-booked-${i}`,
                        title: 'Physics Lab',
                        teacherId: 'teacher-1',
                        studentId: 'student-2',
                        start: `${dateStr}T14:00:00`,
                        end: `${dateStr}T15:00:00`,
                        status: 'booked',
                        meetingLink: 'https://meet.google.com/abc-defg-hij'
                    });
                } else {
                    // Available slot
                    classes.push({
                        id: `future-avail-${i}`,
                        title: 'Math Tutorial',
                        teacherId: 'teacher-1',
                        start: `${dateStr}T09:00:00`,
                        end: `${dateStr}T10:00:00`,
                        status: 'available'
                    });
                }
            }

            // Future classes for Teacher 2
            for (let i = 0; i < 5; i++) {
                const date = addDays(today, i + 1);
                const dateStr = date.toISOString().split('T')[0];
                classes.push({
                    id: `t2-avail-${i}`,
                    title: 'English Conversation',
                    teacherId: 'teacher-2',
                    start: `${dateStr}T16:00:00`,
                    end: `${dateStr}T17:00:00`,
                    status: 'available'
                });
            }

            localStorage.setItem(this.CLASSES_KEY, JSON.stringify(classes));
        }
    }

    getUsers(): User[] {
        if (!this.isBrowser) return [];
        return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    }

    getUserByEmail(email: string): User | undefined {
        return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    getClasses(): ClassSession[] {
        if (!this.isBrowser) return [];
        return JSON.parse(localStorage.getItem(this.CLASSES_KEY) || '[]');
    }

    addClass(newClass: ClassSession): void {
        if (!this.isBrowser) return;
        const classes = this.getClasses();
        classes.push(newClass);
        localStorage.setItem(this.CLASSES_KEY, JSON.stringify(classes));
    }

    updateClass(updatedClass: ClassSession): void {
        if (!this.isBrowser) return;
        const classes = this.getClasses();
        const index = classes.findIndex(c => c.id === updatedClass.id);
        if (index !== -1) {
            classes[index] = updatedClass;
            localStorage.setItem(this.CLASSES_KEY, JSON.stringify(classes));
        }
    }

    deleteClass(classId: string): void {
        if (!this.isBrowser) return;
        let classes = this.getClasses();
        classes = classes.filter(c => c.id !== classId);
        localStorage.setItem(this.CLASSES_KEY, JSON.stringify(classes));
    }
}

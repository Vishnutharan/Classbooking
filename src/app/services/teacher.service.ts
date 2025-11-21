import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface TeacherSubject {
  id: string;
  name: string;
  medium: 'Sinhala' | 'Tamil' | 'English';
  level: 'Primary' | 'Secondary' | 'Advanced';
  description?: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  bio?: string;
  qualifications: string[];
  subjects: TeacherSubject[];
  hourlyRate: number;
  experienceYears: number;
  averageRating: number;
  totalReviews: number;
  totalClasses: number;
  isAvailable: boolean;
  availability: TeacherAvailability[];
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface TeacherAvailability {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface UpdateTeacherRequest {
  bio?: string;
  hourlyRate?: number;
  qualifications?: string[];
  subjects?: TeacherSubject[];
  availability?: TeacherAvailability[];
  isAvailable?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  // MOCK DATA
  private mockTeachers: TeacherProfile[] = [
    {
      id: 'teacher-1',
      userId: 'user-t1',
      fullName: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phoneNumber: '+1234567890',
      profilePicture: 'https://i.pravatar.cc/150?u=sarah',
      bio: 'Experienced Mathematics teacher with 10 years of teaching O/L and A/L students.',
      qualifications: ['BSc in Mathematics', 'PGDE'],
      subjects: [
        { id: 's1', name: 'Mathematics', medium: 'English', level: 'Secondary' },
        { id: 's2', name: 'Pure Mathematics', medium: 'English', level: 'Advanced' }
      ],
      hourlyRate: 1500,
      experienceYears: 10,
      averageRating: 4.8,
      totalReviews: 124,
      totalClasses: 450,
      isAvailable: true,
      availability: [
        { dayOfWeek: 'Monday', startTime: '16:00', endTime: '20:00' },
        { dayOfWeek: 'Wednesday', startTime: '16:00', endTime: '20:00' },
        { dayOfWeek: 'Saturday', startTime: '08:00', endTime: '12:00' }
      ],
      verificationStatus: 'Verified',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15')
    },
    {
      id: 'teacher-2',
      userId: 'user-t2',
      fullName: 'David Kumar',
      email: 'david.kumar@example.com',
      phoneNumber: '+1234567891',
      profilePicture: 'https://i.pravatar.cc/150?u=david',
      bio: 'Physics expert specializing in Advanced Level Physics.',
      qualifications: ['BSc in Physics', 'MSc in Physics'],
      subjects: [
        { id: 's3', name: 'Physics', medium: 'English', level: 'Advanced' }
      ],
      hourlyRate: 2000,
      experienceYears: 8,
      averageRating: 4.9,
      totalReviews: 89,
      totalClasses: 320,
      isAvailable: true,
      availability: [
        { dayOfWeek: 'Tuesday', startTime: '16:00', endTime: '20:00' },
        { dayOfWeek: 'Thursday', startTime: '16:00', endTime: '20:00' },
        { dayOfWeek: 'Sunday', startTime: '08:00', endTime: '14:00' }
      ],
      verificationStatus: 'Verified',
      createdAt: new Date('2023-02-20'),
      updatedAt: new Date('2023-02-20')
    },
    {
      id: 'teacher-3',
      userId: 'user-t3',
      fullName: 'Priya Perera',
      email: 'priya.perera@example.com',
      phoneNumber: '+1234567892',
      profilePicture: 'https://i.pravatar.cc/150?u=priya',
      bio: 'Dedicated Chemistry teacher helping students achieve their best results.',
      qualifications: ['BSc in Chemistry'],
      subjects: [
        { id: 's4', name: 'Chemistry', medium: 'Sinhala', level: 'Advanced' },
        { id: 's5', name: 'Science', medium: 'Sinhala', level: 'Secondary' }
      ],
      hourlyRate: 1800,
      experienceYears: 5,
      averageRating: 4.7,
      totalReviews: 56,
      totalClasses: 200,
      isAvailable: true,
      availability: [
        { dayOfWeek: 'Monday', startTime: '14:00', endTime: '18:00' },
        { dayOfWeek: 'Friday', startTime: '14:00', endTime: '18:00' }
      ],
      verificationStatus: 'Verified',
      createdAt: new Date('2023-03-10'),
      updatedAt: new Date('2023-03-10')
    },
    {
      id: 'teacher-4',
      userId: 'user-t4',
      fullName: 'Mohamed Fazil',
      email: 'mohamed.fazil@example.com',
      phoneNumber: '+1234567893',
      profilePicture: 'https://i.pravatar.cc/150?u=fazil',
      bio: 'ICT teacher with industry experience.',
      qualifications: ['BSc in IT', 'Software Engineer'],
      subjects: [
        { id: 's6', name: 'ICT', medium: 'English', level: 'Secondary' },
        { id: 's7', name: 'ICT', medium: 'English', level: 'Advanced' }
      ],
      hourlyRate: 1600,
      experienceYears: 4,
      averageRating: 4.6,
      totalReviews: 42,
      totalClasses: 150,
      isAvailable: true,
      availability: [
        { dayOfWeek: 'Saturday', startTime: '13:00', endTime: '17:00' },
        { dayOfWeek: 'Sunday', startTime: '13:00', endTime: '17:00' }
      ],
      verificationStatus: 'Verified',
      createdAt: new Date('2023-04-05'),
      updatedAt: new Date('2023-04-05')
    }
  ];

  private teachersSubject = new BehaviorSubject<TeacherProfile[]>(this.mockTeachers);
  teachers$ = this.teachersSubject.asObservable();

  getAllTeachers(): Observable<TeacherProfile[]> {
    // Simulate network delay
    return of(this.mockTeachers).pipe(delay(500));
  }

  getTeachersBySubject(subject: string): Observable<TeacherProfile[]> {
    const filtered = this.mockTeachers.filter(t =>
      t.subjects.some(s => s.name.toLowerCase().includes(subject.toLowerCase()))
    );
    return of(filtered).pipe(delay(500));
  }

  getTeachersByLevel(level: string): Observable<TeacherProfile[]> {
    const filtered = this.mockTeachers.filter(t =>
      t.subjects.some(s => s.level === level)
    );
    return of(filtered).pipe(delay(500));
  }

  getTeacherById(id: string): Observable<TeacherProfile> {
    const teacher = this.mockTeachers.find(t => t.id === id);
    if (!teacher) {
      throw new Error('Teacher not found');
    }
    return of(teacher).pipe(delay(300));
  }

  getMyProfile(): Observable<TeacherProfile> {
    // Mock returning the first teacher as "me" for testing teacher view
    return of(this.mockTeachers[0]).pipe(delay(300));
  }

  updateProfile(update: UpdateTeacherRequest): Observable<TeacherProfile> {
    // Mock update
    const current = this.mockTeachers[0];
    const updated = { ...current, ...update };
    this.mockTeachers[0] = updated;
    this.teachersSubject.next([...this.mockTeachers]);
    return of(updated).pipe(delay(500));
  }

  addSubject(subject: TeacherSubject): Observable<TeacherProfile> {
    const current = this.mockTeachers[0];
    current.subjects.push(subject);
    return of(current).pipe(delay(300));
  }

  removeSubject(subjectId: string): Observable<TeacherProfile> {
    const current = this.mockTeachers[0];
    current.subjects = current.subjects.filter(s => s.id !== subjectId);
    return of(current).pipe(delay(300));
  }

  updateAvailability(availability: TeacherAvailability[]): Observable<TeacherProfile> {
    const current = this.mockTeachers[0];
    current.availability = availability;
    return of(current).pipe(delay(300));
  }

  searchTeachers(filters: any): Observable<TeacherProfile[]> {
    // Simple mock search
    return of(this.mockTeachers).pipe(delay(500));
  }

  getTopRatedTeachers(limit: number = 10): Observable<TeacherProfile[]> {
    const sorted = [...this.mockTeachers].sort((a, b) => b.averageRating - a.averageRating);
    return of(sorted.slice(0, limit)).pipe(delay(300));
  }

  rateTeacher(teacherId: string, rating: number, review: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  getTeacherReviews(teacherId: string): Observable<any[]> {
    return of([
      { id: 1, studentName: 'Student A', rating: 5, comment: 'Great teacher!', date: new Date() },
      { id: 2, studentName: 'Student B', rating: 4, comment: 'Good explanation.', date: new Date() }
    ]).pipe(delay(300));
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    return of({ url: URL.createObjectURL(file) }).pipe(delay(500));
  }
}
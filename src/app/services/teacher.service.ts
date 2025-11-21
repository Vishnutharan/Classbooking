import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  private http = inject(HttpClient);
  private apiUrl = 'api/teachers';
  
  private teachersSubject = new BehaviorSubject<TeacherProfile[]>([]);
  teachers$ = this.teachersSubject.asObservable();

  getAllTeachers(): Observable<TeacherProfile[]> {
    return this.http.get<TeacherProfile[]>(`${this.apiUrl}`)
      .pipe(
        tap(teachers => this.teachersSubject.next(teachers))
      );
  }

  getTeachersBySubject(subject: string): Observable<TeacherProfile[]> {
    return this.http.get<TeacherProfile[]>(`${this.apiUrl}/by-subject/${subject}`);
  }

  getTeachersByLevel(level: string): Observable<TeacherProfile[]> {
    return this.http.get<TeacherProfile[]>(`${this.apiUrl}/by-level/${level}`);
  }

  getTeacherById(id: string): Observable<TeacherProfile> {
    return this.http.get<TeacherProfile>(`${this.apiUrl}/${id}`);
  }

  getMyProfile(): Observable<TeacherProfile> {
    return this.http.get<TeacherProfile>(`${this.apiUrl}/profile/me`);
  }

  updateProfile(update: UpdateTeacherRequest): Observable<TeacherProfile> {
    return this.http.put<TeacherProfile>(`${this.apiUrl}/profile/update`, update);
  }

  addSubject(subject: TeacherSubject): Observable<TeacherProfile> {
    return this.http.post<TeacherProfile>(`${this.apiUrl}/subjects/add`, subject);
  }

  removeSubject(subjectId: string): Observable<TeacherProfile> {
    return this.http.delete<TeacherProfile>(`${this.apiUrl}/subjects/${subjectId}`);
  }

  updateAvailability(availability: TeacherAvailability[]): Observable<TeacherProfile> {
    return this.http.put<TeacherProfile>(`${this.apiUrl}/availability/update`, { availability });
  }

  searchTeachers(filters: any): Observable<TeacherProfile[]> {
    return this.http.get<TeacherProfile[]>(`${this.apiUrl}/search`, { params: filters });
  }

  getTopRatedTeachers(limit: number = 10): Observable<TeacherProfile[]> {
    return this.http.get<TeacherProfile[]>(`${this.apiUrl}/top-rated`, { params: { limit } });
  }

  rateTeacher(teacherId: string, rating: number, review: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${teacherId}/rate`, { rating, review });
  }

  getTeacherReviews(teacherId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${teacherId}/reviews`);
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/profile-picture/upload`, formData);
  }
}
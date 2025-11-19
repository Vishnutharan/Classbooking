import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  gradeLevel: 'Primary' | 'OLevel' | 'ALevel';
  school?: string;
  focusAreas: string[];
  targetExams: string[]; // O-Level, A-Level, Scholarship, etc.
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateStudentRequest {
  gradeLevel?: string;
  school?: string;
  focusAreas?: string[];
  targetExams?: string[];
}

export interface ExamPreparation {
  id: string;
  title: string;
  description: string;
  examType: 'OLevel' | 'ALevel' | 'Scholarship';
  subject: string;
  resources: Resource[];
  materials: string[];
  createdAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  type: 'Video' | 'PDF' | 'Quiz' | 'Notes' | 'PastPaper';
  url: string;
  description?: string;
}

export interface UpdateStudentProfileRequest {
  phoneNumber?: string;
  gradeLevel?: string;
  school?: string;
  focusAreas?: string[];
  targetExams?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'api/students';
  
  private studentSubject = new BehaviorSubject<StudentProfile | null>(null);
  student$ = this.studentSubject.asObservable();

  getMyProfile(): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.apiUrl}/profile/me`)
      .pipe(
        tap(profile => this.studentSubject.next(profile))
      );
  }

  getStudentProfile(id: string): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.apiUrl}/${id}`);
  }

  updateProfile(update: UpdateStudentProfileRequest): Observable<StudentProfile> {
    return this.http.put<StudentProfile>(`${this.apiUrl}/profile/update`, update)
      .pipe(
        tap(profile => this.studentSubject.next(profile))
      );
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/profile-picture/upload`, formData);
  }

  getExamPreparations(examType?: string): Observable<ExamPreparation[]> {
    const params = examType ? { examType } : {};
    return this.http.get<ExamPreparation[]>(`${this.apiUrl}/exam-preparations`, { params });
  }

  getExamPreparationById(id: string): Observable<ExamPreparation> {
    return this.http.get<ExamPreparation>(`${this.apiUrl}/exam-preparations/${id}`);
  }

  getStudyMaterials(subject: string, level?: string): Observable<Resource[]> {
    const params = level ? { subject, level } : { subject };
    return this.http.get<Resource[]>(`${this.apiUrl}/study-materials`, { params });
  }

  getPastPapers(subject: string, examType: string, year?: number): Observable<Resource[]> {
    const params: any = { subject, examType };
    if (year) params.year = year;
    return this.http.get<Resource[]>(`${this.apiUrl}/past-papers`, { params });
  }

  getProgressReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/progress-report`);
  }

  getRecommendedTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recommended-teachers`);
  }

  getSummaryStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary-stats`);
  }
}
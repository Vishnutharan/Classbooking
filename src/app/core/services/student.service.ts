import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentProfile, Resource, ExamPreparation } from '../models/shared.models';
import { environment } from '../../../environments/environment';

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
  private apiUrl = `${environment.apiUrl}/students`;

  getMyProfile(): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.apiUrl}/profile`);
  }

  getStudentProfile(id: string): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.apiUrl}/${id}`);
  }

  updateProfile(update: UpdateStudentProfileRequest): Observable<StudentProfile> {
    return this.http.put<StudentProfile>(`${this.apiUrl}/profile`, update);
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/profile/picture`, formData);
  }

  getExamPreparations(examType?: string): Observable<ExamPreparation[]> {
    let params = new HttpParams();
    if (examType) {
      params = params.set('examType', examType);
    }
    return this.http.get<ExamPreparation[]>(`${this.apiUrl}/exam-preparations`, { params });
  }

  getExamPreparationById(id: string): Observable<ExamPreparation> {
    return this.http.get<ExamPreparation>(`${this.apiUrl}/exam-preparations/${id}`);
  }

  getStudyMaterials(subject: string, level?: string): Observable<Resource[]> {
    let params = new HttpParams().set('subject', subject);
    if (level) {
      params = params.set('level', level);
    }
    return this.http.get<Resource[]>(`${this.apiUrl}/study-materials`, { params });
  }

  getPastPapers(subject: string, examType: string, year?: number): Observable<Resource[]> {
    let params = new HttpParams()
      .set('subject', subject)
      .set('examType', examType);

    if (year) {
      params = params.set('year', year.toString());
    }
    return this.http.get<Resource[]>(`${this.apiUrl}/past-papers`, { params });
  }

  getProgressReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/progress-report`);
  }

  getRecommendedTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recommended-teachers`);
  }

  getSummaryStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary-stats`);
  }

  getStudyGoals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/study-goals`);
  }
}
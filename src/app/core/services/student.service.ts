import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { StudentProfile, Resource, ExamPreparation } from '../models/shared.models';
import { environment } from '../../../environments/environment';
import { MockDataService } from './mock-data.service';

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
  private mockData = inject(MockDataService);
  private apiUrl = `${environment.apiUrl}/students`;

  getSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary`).pipe(
      catchError(() => this.mockData.getStudentSummary())
    );
  }

  getMyProfile(): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.apiUrl}/profile`).pipe(
      catchError(() => this.mockData.getStudentProfile())
    );
  }

  getStudentProfile(id: string): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => this.mockData.getStudentProfile(id))
    );
  }

  updateProfile(update: UpdateStudentProfileRequest): Observable<StudentProfile> {
    return this.http.put<StudentProfile>(`${this.apiUrl}/profile`, update).pipe(
      catchError(() => this.mockData.getStudentProfile())
    );
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/profile/picture`, formData).pipe(
      catchError(() => of({ url: 'https://via.placeholder.com/150' }))
    );
  }

  getExamPreparations(examType?: string): Observable<ExamPreparation[]> {
    let params = new HttpParams();
    if (examType) {
      params = params.set('examType', examType);
    }
    return this.http.get<ExamPreparation[]>(`${this.apiUrl}/exam-preparations`, { params }).pipe(
      catchError(() => this.mockData.getExamPreparations(examType))
    );
  }

  getExamPreparationById(id: string): Observable<ExamPreparation> {
    return this.http.get<ExamPreparation>(`${this.apiUrl}/exam-preparations/${id}`).pipe(
      catchError(() =>
        this.mockData.getExamPreparations().pipe(
          map(preps => preps.find(p => p.id === id) || preps[0]),
          catchError(() =>
            of({
              id,
              examType: 'OLevel',
              subject: 'Mathematics',
              description: 'Mock preparation plan',
              resources: []
            } as ExamPreparation)
          )
        )
      )
    );
  }

  getStudyMaterials(subject: string, level?: string): Observable<Resource[]> {
    let params = new HttpParams().set('subject', subject);
    if (level) {
      params = params.set('level', level);
    }
    return this.http.get<Resource[]>(`${this.apiUrl}/study-materials`, { params }).pipe(
      catchError(() => this.mockData.getStudyMaterials(subject))
    );
  }

  getPastPapers(subject: string, examType: string, year?: number): Observable<Resource[]> {
    let params = new HttpParams()
      .set('subject', subject)
      .set('examType', examType);

    if (year) {
      params = params.set('year', year.toString());
    }
    return this.http.get<Resource[]>(`${this.apiUrl}/past-papers`, { params }).pipe(
      catchError(() => this.mockData.getPastPapers(subject, examType))
    );
  }

  getProgressReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/progress-report`).pipe(
      catchError(() => this.mockData.getStudentProgress())
    );
  }

  getRecommendedTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recommended-teachers`).pipe(
      catchError(() => this.mockData.getRecommendedTeachers())
    );
  }

  getSummaryStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary-stats`).pipe(
      catchError(() => this.mockData.getStudentSummary())
    );
  }

  getStudyGoals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/study-goals`).pipe(
      catchError(() => this.mockData.getStudyGoals())
    );
  }

  // Review methods
  getMyReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-reviews`).pipe(
      catchError(() => this.mockData.getReviews())
    );
  }

  submitReview(review: { teacherId: string; rating: number; comment: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reviews`, review).pipe(
      catchError(() => of({ ...review, id: 'review-mock' }))
    );
  }

  updateReview(reviewId: string, update: { rating: number; comment: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reviews/${reviewId}`, update).pipe(
      catchError(() => of({ id: reviewId, ...update }))
    );
  }

  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/reviews/${reviewId}`).pipe(
      catchError(() => of({ id: reviewId, deleted: true }))
    );
  }

  // Lesson plans (student view)
  getLessonPlansForTeacher(teacherId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lesson-plans`, {
      params: { teacherId }
    }).pipe(
      catchError(() => of([] as any[]))
    );
  }
}

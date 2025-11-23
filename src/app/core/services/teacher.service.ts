import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeacherProfile, TeacherSubject, TeacherAvailability } from '../models/shared.models';
import { environment } from '../../../environments/environment';

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
  private apiUrl = `${environment.apiUrl}/teachers`;

  getAllTeachers(): Observable<TeacherProfile[]> {
    return this.http.get<TeacherProfile[]>(this.apiUrl);
  }

  getTeachersBySubject(subject: string): Observable<TeacherProfile[]> {
    return this.http.get<TeacherProfile[]>(`${this.apiUrl}/search`, {
      params: { subject }
    });
  }

  getTeachersByLevel(level: string): Observable<TeacherProfile[]> {
    return this.http.get<TeacherProfile[]>(`${this.apiUrl}/search`, {
      params: { level }
    });
  }

  getTeacherById(id: string): Observable<TeacherProfile> {
    return this.http.get<TeacherProfile>(`${this.apiUrl}/${id}`);
  }

  // PROFILE MANAGEMENT (uses private teacher management API)
  getMyProfile(): Observable<TeacherProfile> {
    return this.http.get<TeacherProfile>(`${environment.apiUrl}/teacher/profile`);
  }

  updateProfile(update: UpdateTeacherRequest): Observable<TeacherProfile> {
    return this.http.put<TeacherProfile>(`${environment.apiUrl}/teacher/profile`, update);
  }

  addSubject(subject: TeacherSubject): Observable<TeacherProfile> {
    return this.http.post<TeacherProfile>(`${environment.apiUrl}/teacher/profile/subjects`, subject);
  }

  removeSubject(subjectId: string): Observable<TeacherProfile> {
    return this.http.delete<TeacherProfile>(`${environment.apiUrl}/teacher/profile/subjects/${subjectId}`);
  }

  updateAvailability(availability: TeacherAvailability[]): Observable<TeacherProfile> {
    return this.http.put<TeacherProfile>(`${environment.apiUrl}/teacher/profile/availability`, availability);
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${environment.apiUrl}/teacher/profile/picture`, formData);
  }

  // PUBLIC APIs
  searchTeachers(filters: any): Observable<TeacherProfile[]> {
    let params = new HttpParams();
    for (const key in filters) {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    return this.http.get<TeacherProfile[]>(`${this.apiUrl}/search`, { params });
  }

  getTopRatedTeachers(limit: number = 10): Observable<TeacherProfile[]> {
    return this.http.get<TeacherProfile[]>(`${this.apiUrl}/top-rated`, {
      params: { limit: limit.toString() }
    });
  }

  rateTeacher(teacherId: string, rating: number, review: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${teacherId}/rate`, { rating, review });
  }

  getTeacherReviews(teacherId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${teacherId}/reviews`);
  }
}
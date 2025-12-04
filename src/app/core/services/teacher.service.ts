import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { TeacherProfile, TeacherSubject, TeacherAvailability, TeacherAvailabilitySlot } from '../models/shared.models';
import { environment } from '../../../environments/environment';
import { MockDataService } from './mock-data.service';
import { AuthService } from './auth.service';

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
  private mockData = inject(MockDataService);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/teacher`; // Use /teacher endpoint
  private publicApiUrl = `${environment.apiUrl}/teachers`; // Use /teachers for public APIs

  getAllTeachers(): Observable<TeacherProfile[]> {
    return this.http.get<TeacherProfile[]>(this.publicApiUrl).pipe(
      catchError(() => this.mockData.getAllTeachers())
    );
  }

  getTeachersBySubject(subject: string): Observable<TeacherProfile[]> {
    return this.http.get<TeacherProfile[]>(`${this.publicApiUrl}/search`, {
      params: { subject }
    }).pipe(
      catchError(() => this.mockData.getAllTeachers())
    );
  }

  getTeachersByLevel(level: string): Observable<TeacherProfile[]> {
    return this.http.get<TeacherProfile[]>(`${this.publicApiUrl}/search`, {
      params: { level }
    }).pipe(
      catchError(() => this.mockData.getAllTeachers())
    );
  }

  getTeacherById(id: string): Observable<TeacherProfile> {
    return this.http.get<TeacherProfile>(`${this.publicApiUrl}/${id}`).pipe(
      catchError(() => this.mockData.getTeacherById(id))
    );
  }

  // PROFILE MANAGEMENT (uses private teacher management API)
  getMyProfile(): Observable<TeacherProfile> {
    const userId = this.authService.getCurrentUser()?.id;
    return this.http.get<TeacherProfile>(`${this.apiUrl}/profile`).pipe(
      catchError(() => this.mockData.getTeacherProfileForUser(userId))
    );
  }

  updateProfile(update: UpdateTeacherRequest): Observable<TeacherProfile> {
    const userId = this.authService.getCurrentUser()?.id;
    return this.http.put<TeacherProfile>(`${this.apiUrl}/profile`, update).pipe(
      catchError(() => this.mockData.updateTeacherProfile({ userId, ...update }))
    );
  }

  addSubject(subject: TeacherSubject): Observable<TeacherProfile> {
    const teacherId = this.authService.getCurrentUser()?.id || 'teacher-1';
    return this.http.post<TeacherProfile>(`${this.apiUrl}/profile/subjects`, subject).pipe(
      catchError(() => this.mockData.addTeacherSubject(teacherId, subject))
    );
  }

  removeSubject(subjectId: string): Observable<TeacherProfile> {
    return this.http.delete<TeacherProfile>(`${this.apiUrl}/profile/subjects/${subjectId}`).pipe(
      catchError(() => this.mockData.getTeacherProfileForUser(this.authService.getCurrentUser()?.id))
    );
  }

  getMyAvailabilitySlots(startDate?: Date, endDate?: Date): Observable<TeacherAvailabilitySlot[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());

    return this.http.get<TeacherAvailabilitySlot[]>(`${this.apiUrl}/availability/slots`, { params }).pipe(
      catchError(() => of([]))
    );
  }

  addAvailabilitySlot(slot: { date: Date; startTime: string; endTime: string; }): Observable<TeacherAvailabilitySlot> {
    return this.http.post<TeacherAvailabilitySlot>(`${this.apiUrl}/availability/slots`, slot).pipe(
      catchError(() => this.mockData.getTeacherProfileForUser(this.authService.getCurrentUser()?.id).pipe(
        map(() => ({
          id: 'temp-slot',
          teacherProfileId: this.authService.getCurrentUser()?.id || '',
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: 'Available'
        } as TeacherAvailabilitySlot))
      ))
    );
  }

  deleteAvailabilitySlot(slotId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/availability/slots/${slotId}`).pipe(
      catchError(() => of(void 0))
    );
  }

  updateAvailability(availability: TeacherAvailability[]): Observable<TeacherProfile> {
    const teacherId = this.authService.getCurrentUser()?.id || 'teacher-1';
    return this.http.put<TeacherProfile>(`${this.apiUrl}/profile/availability`, availability).pipe(
      catchError(() => this.mockData.updateTeacherAvailability(teacherId, availability))
    );
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/profile/picture`, formData).pipe(
      catchError(() => of({ url: 'https://via.placeholder.com/150' }))
    );
  }

  // PUBLIC APIs
  searchTeachers(filters: any): Observable<TeacherProfile[]> {
    let params = new HttpParams();
    for (const key in filters) {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    return this.http.get<TeacherProfile[]>(`${this.publicApiUrl}/search`, { params }).pipe(
      catchError(() => this.mockData.getAllTeachers())
    );
  }

  getTopRatedTeachers(limit: number = 10): Observable<TeacherProfile[]> {
    return this.http.get<TeacherProfile[]>(`${this.publicApiUrl}/top-rated`, {
      params: { limit: limit.toString() }
    }).pipe(
      catchError(() => this.mockData.getAllTeachers())
    );
  }

  rateTeacher(teacherId: string, rating: number, review: string): Observable<any> {
    return this.http.post(`${this.publicApiUrl}/${teacherId}/rate`, { rating, review }).pipe(
      catchError(() => of({ success: true }))
    );
  }

  getTeacherReviews(teacherId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.publicApiUrl}/${teacherId}/reviews`).pipe(
      catchError(() => this.mockData.getTeacherReviews())
    );
  }

  getTeacherAvailabilitySlots(teacherId: string, startDate?: Date, endDate?: Date): Observable<TeacherAvailabilitySlot[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());

    return this.http.get<TeacherAvailabilitySlot[]>(`${this.publicApiUrl}/${teacherId}/availability/slots`, { params }).pipe(
      catchError(() => of([]))
    );
  }
}

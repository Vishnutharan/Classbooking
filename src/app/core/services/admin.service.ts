import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { User, PublicHoliday, ExamSeason, SystemSettings } from '../models/shared.models';
import { environment } from '../../../environments/environment';
import { MockDataService } from './mock-data.service';

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averageRating: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  role: 'Student' | 'Teacher' | 'Admin';
  phoneNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);
  private apiUrl = `${environment.apiUrl}/admin`;

  // User Management
  getAllUsers(page: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(`${this.apiUrl}/users`, { params }).pipe(
      catchError(() => this.mockData.getAllUsers(page, pageSize))
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(() =>
        this.mockData.getAllUsers(1, 100).pipe(
          map(res => res.users.find(u => u.id === id) || res.users[0]),
          catchError(() => of(undefined as unknown as User))
        )
      )
    );
  }

  createUser(request: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, request).pipe(
      catchError(() => this.mockData.createUser(request))
    );
  }

  updateUser(id: string, updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, updates).pipe(
      catchError(() => this.mockData.updateUser(id, updates))
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`).pipe(
      catchError(() => of(true))
    );
  }

  suspendUser(id: string, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${id}/suspend`, { reason }).pipe(
      catchError(() => this.mockData.suspendUser(id))
    );
  }

  activateUser(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${id}/activate`, {}).pipe(
      catchError(() => this.mockData.activateUser(id))
    );
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/search`, {
      params: { query }
    }).pipe(
      catchError(() => of([] as User[]))
    );
  }

  // Timetable Management
  getPublicHolidays(): Observable<PublicHoliday[]> {
    return this.http.get<PublicHoliday[]>(`${this.apiUrl}/holidays`).pipe(
      catchError(() => this.mockData.getPublicHolidays())
    );
  }

  createPublicHoliday(holiday: PublicHoliday): Observable<PublicHoliday> {
    return this.http.post<PublicHoliday>(`${this.apiUrl}/holidays`, holiday).pipe(
      catchError(() => this.mockData.createPublicHoliday(holiday))
    );
  }

  updatePublicHoliday(id: string, holiday: Partial<PublicHoliday>): Observable<PublicHoliday> {
    return this.http.put<PublicHoliday>(`${this.apiUrl}/holidays/${id}`, holiday).pipe(
      catchError(() => this.mockData.updatePublicHoliday(id, holiday))
    );
  }

  deletePublicHoliday(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/holidays/${id}`).pipe(
      catchError(() => this.mockData.deletePublicHoliday(id))
    );
  }

  // Exam Seasons
  getExamSeasons(): Observable<ExamSeason[]> {
    return this.http.get<ExamSeason[]>(`${this.apiUrl}/exam-seasons`).pipe(
      catchError(() => this.mockData.getExamSeasons())
    );
  }

  createExamSeason(season: ExamSeason): Observable<ExamSeason> {
    return this.http.post<ExamSeason>(`${this.apiUrl}/exam-seasons`, season).pipe(
      catchError(() => this.mockData.createExamSeason(season))
    );
  }

  updateExamSeason(id: string, season: Partial<ExamSeason>): Observable<ExamSeason> {
    return this.http.put<ExamSeason>(`${this.apiUrl}/exam-seasons/${id}`, season).pipe(
      catchError(() => this.mockData.updateExamSeason(id, season))
    );
  }

  deleteExamSeason(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/exam-seasons/${id}`).pipe(
      catchError(() => this.mockData.deleteExamSeason(id))
    );
  }

  // System Settings
  getSystemSettings(): Observable<SystemSettings> {
    return this.http.get<SystemSettings>(`${this.apiUrl}/settings`).pipe(
      catchError(() => this.mockData.getSystemSettings())
    );
  }

  updateSystemSettings(settings: Partial<SystemSettings>): Observable<SystemSettings> {
    return this.http.put<SystemSettings>(`${this.apiUrl}/settings`, settings).pipe(
      catchError(() => this.mockData.updateSystemSettings(settings))
    );
  }

  // Reports and Statistics
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats/dashboard`).pipe(
      catchError(() => this.mockData.getDashboardStats())
    );
  }

  getUserStats(period: 'daily' | 'weekly' | 'monthly'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/users`, { params: { period } }).pipe(
      catchError(() => this.mockData.getUserStats())
    );
  }

  getBookingStats(period: 'daily' | 'weekly' | 'monthly'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/bookings`, { params: { period } }).pipe(
      catchError(() => this.mockData.getBookingStats())
    );
  }

  getRevenueStats(period: 'daily' | 'weekly' | 'monthly'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/revenue`, { params: { period } }).pipe(
      catchError(() => this.mockData.getRevenueStats())
    );
  }

  getTeacherPerformanceStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/teacher-performance`).pipe(
      catchError(() => this.mockData.getTeacherPerformanceStats())
    );
  }

  exportBookingReport(format: 'pdf' | 'excel'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reports/bookings`, {
      params: { format },
      responseType: 'blob'
    }).pipe(
      catchError(() => this.mockData.exportReport())
    );
  }

  exportUserReport(format: 'pdf' | 'excel'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reports/users`, {
      params: { format },
      responseType: 'blob'
    }).pipe(
      catchError(() => this.mockData.exportReport())
    );
  }

  exportRevenueReport(format: 'pdf' | 'excel'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reports/revenue`, {
      params: { format },
      responseType: 'blob'
    }).pipe(
      catchError(() => this.mockData.exportReport())
    );
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'Student' | 'Teacher' | 'Admin';
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: Date;
  lastLogin: Date;
}

export interface PublicHoliday {
  id: string;
  name: string;
  date: Date;
  description?: string;
}

export interface ExamSeason {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  examType: 'OLevel' | 'ALevel' | 'Scholarship';
}

export interface SystemSettings {
  id: string;
  platformName: string;
  platformEmail: string;
  defaultHourlyRate: number;
  maxClassDurationMinutes: number;
  minClassDurationMinutes: number;
  cancellationDeadlineHours: number;
  platformCommissionPercentage: number;
}

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
  private apiUrl = 'api/admin';

  // User Management
  getAllUsers(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, { 
      params: { page, pageSize } 
    });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  createUser(request: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/create`, request);
  }

  updateUser(id: string, updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, updates);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  suspendUser(id: string, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}/suspend`, { reason });
  }

  activateUser(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}/activate`, {});
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/search`, {
      params: { query }
    });
  }

  // Timetable Management
  getPublicHolidays(): Observable<PublicHoliday[]> {
    return this.http.get<PublicHoliday[]>(`${this.apiUrl}/timetable/holidays`);
  }

  createPublicHoliday(holiday: PublicHoliday): Observable<PublicHoliday> {
    return this.http.post<PublicHoliday>(`${this.apiUrl}/timetable/holidays`, holiday);
  }

  updatePublicHoliday(id: string, holiday: Partial<PublicHoliday>): Observable<PublicHoliday> {
    return this.http.put<PublicHoliday>(`${this.apiUrl}/timetable/holidays/${id}`, holiday);
  }

  deletePublicHoliday(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/timetable/holidays/${id}`);
  }

  // Exam Seasons
  getExamSeasons(): Observable<ExamSeason[]> {
    return this.http.get<ExamSeason[]>(`${this.apiUrl}/timetable/exam-seasons`);
  }

  createExamSeason(season: ExamSeason): Observable<ExamSeason> {
    return this.http.post<ExamSeason>(`${this.apiUrl}/timetable/exam-seasons`, season);
  }

  updateExamSeason(id: string, season: Partial<ExamSeason>): Observable<ExamSeason> {
    return this.http.put<ExamSeason>(`${this.apiUrl}/timetable/exam-seasons/${id}`, season);
  }

  deleteExamSeason(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/timetable/exam-seasons/${id}`);
  }

  // System Settings
  getSystemSettings(): Observable<SystemSettings> {
    return this.http.get<SystemSettings>(`${this.apiUrl}/settings`);
  }

  updateSystemSettings(settings: Partial<SystemSettings>): Observable<SystemSettings> {
    return this.http.put<SystemSettings>(`${this.apiUrl}/settings`, settings);
  }

  // Reports and Statistics
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats/dashboard`);
  }

  getUserStats(period: 'daily' | 'weekly' | 'monthly'): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/users`, { params: { period } });
  }

  getBookingStats(period: 'daily' | 'weekly' | 'monthly'): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/bookings`, { params: { period } });
  }

  getRevenueStats(period: 'daily' | 'weekly' | 'monthly'): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/revenue`, { params: { period } });
  }

  getTeacherPerformanceStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/teacher-performance`);
  }

  exportBookingReport(format: 'pdf' | 'excel'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reports/bookings/export`, {
      params: { format },
      responseType: 'blob'
    });
  }

  exportUserReport(format: 'pdf' | 'excel'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reports/users/export`, {
      params: { format },
      responseType: 'blob'
    });
  }

  exportRevenueReport(format: 'pdf' | 'excel'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reports/revenue/export`, {
      params: { format },
      responseType: 'blob'
    });
  }
}
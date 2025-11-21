import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DemoDataService } from './demo-data.service';
import { User, PublicHoliday, ExamSeason, SystemSettings } from '../models/shared.models';

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
  private demoData = inject(DemoDataService);

  // User Management
  getAllUsers(page: number = 1, pageSize: number = 10): Observable<any> {
    const users = this.demoData.getUsers();
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return of({
      users: users.slice(start, end),
      total: users.length,
      page,
      pageSize
    }).pipe(delay(500));
  }

  getUserById(id: string): Observable<User> {
    const user = this.demoData.getUsers().find(u => u.id === id);
    if (!user) return throwError(() => new Error('User not found'));
    return of(user).pipe(delay(300));
  }

  createUser(request: CreateUserRequest): Observable<User> {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: request.email,
      // password: request.password, // Password should not be stored directly in User interface or returned
      fullName: request.fullName,
      role: request.role,
      phoneNumber: request.phoneNumber,
      status: 'Active',
      createdAt: new Date(),
      lastLogin: new Date() // Added lastLogin to match User interface
    };
    this.demoData.addUser(newUser);
    return of(newUser).pipe(delay(500));
  }

  updateUser(id: string, updates: Partial<User>): Observable<User> {
    const user = this.demoData.getUsers().find(u => u.id === id);
    if (!user) return throwError(() => new Error('User not found'));

    const updatedUser = { ...user, ...updates };
    this.demoData.updateUser(updatedUser);
    return of(updatedUser).pipe(delay(500));
  }

  deleteUser(id: string): Observable<any> {
    // In a real app, we might delete. For demo, maybe just disable?
    // But DemoDataService doesn't have deleteUser yet.
    // Let's just simulate success for now or add delete to DemoDataService if needed.
    // For now, let's set status to Inactive
    const user = this.demoData.getUsers().find(u => u.id === id);
    if (user) {
      user.status = 'Inactive';
      this.demoData.updateUser(user);
    }
    return of({ success: true }).pipe(delay(500));
  }

  suspendUser(id: string, reason: string): Observable<any> {
    const user = this.demoData.getUsers().find(u => u.id === id);
    if (user) {
      user.status = 'Suspended';
      this.demoData.updateUser(user);
    }
    return of({ success: true }).pipe(delay(500));
  }

  activateUser(id: string): Observable<any> {
    const user = this.demoData.getUsers().find(u => u.id === id);
    if (user) {
      user.status = 'Active';
      this.demoData.updateUser(user);
    }
    return of({ success: true }).pipe(delay(500));
  }

  searchUsers(query: string): Observable<User[]> {
    const users = this.demoData.getUsers().filter(u =>
      u.fullName.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
    );
    return of(users).pipe(delay(500));
  }

  // Timetable Management
  getPublicHolidays(): Observable<PublicHoliday[]> {
    return of([]).pipe(delay(300));
  }

  createPublicHoliday(holiday: PublicHoliday): Observable<PublicHoliday> {
    return of(holiday).pipe(delay(300));
  }

  updatePublicHoliday(id: string, holiday: Partial<PublicHoliday>): Observable<PublicHoliday> {
    return of({ ...holiday, id } as PublicHoliday).pipe(delay(300));
  }

  deletePublicHoliday(id: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  // Exam Seasons
  getExamSeasons(): Observable<ExamSeason[]> {
    return of([]).pipe(delay(300));
  }

  createExamSeason(season: ExamSeason): Observable<ExamSeason> {
    return of(season).pipe(delay(300));
  }

  updateExamSeason(id: string, season: Partial<ExamSeason>): Observable<ExamSeason> {
    return of({ ...season, id } as ExamSeason).pipe(delay(300));
  }

  deleteExamSeason(id: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  // System Settings
  getSystemSettings(): Observable<SystemSettings> {
    return of(this.demoData.getSettings()).pipe(delay(300));
  }

  updateSystemSettings(settings: Partial<SystemSettings>): Observable<SystemSettings> {
    // In a real app, we'd merge and save. 
    // DemoDataService doesn't have updateSettings exposed publicly yet, but let's assume it's fine for now
    return of({ ...this.demoData.getSettings(), ...settings }).pipe(delay(300));
  }

  // Reports and Statistics
  getDashboardStats(): Observable<DashboardStats> {
    const users = this.demoData.getUsers();
    const bookings = this.demoData.getBookings();

    return of({
      totalUsers: users.length,
      totalStudents: users.filter(u => u.role === 'Student').length,
      totalTeachers: users.filter(u => u.role === 'Teacher').length,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === 'Pending').length,
      completedBookings: bookings.filter(b => b.status === 'Completed').length,
      totalRevenue: 150000, // Mock
      averageRating: 4.5
    }).pipe(delay(500));
  }

  getUserStats(period: 'daily' | 'weekly' | 'monthly'): Observable<any> {
    return of({ labels: ['Mon', 'Tue', 'Wed'], data: [10, 15, 8] }).pipe(delay(500));
  }

  getBookingStats(period: 'daily' | 'weekly' | 'monthly'): Observable<any> {
    return of({ labels: ['Mon', 'Tue', 'Wed'], data: [5, 12, 20] }).pipe(delay(500));
  }

  getRevenueStats(period: 'daily' | 'weekly' | 'monthly'): Observable<any> {
    return of({ labels: ['Mon', 'Tue', 'Wed'], data: [5000, 12000, 20000] }).pipe(delay(500));
  }

  getTeacherPerformanceStats(): Observable<any> {
    return of([]).pipe(delay(500));
  }

  exportBookingReport(format: 'pdf' | 'excel'): Observable<Blob> {
    return of(new Blob(['Mock Report'], { type: 'text/plain' })).pipe(delay(1000));
  }

  exportUserReport(format: 'pdf' | 'excel'): Observable<Blob> {
    return of(new Blob(['Mock Report'], { type: 'text/plain' })).pipe(delay(1000));
  }

  exportRevenueReport(format: 'pdf' | 'excel'): Observable<Blob> {
    return of(new Blob(['Mock Report'], { type: 'text/plain' })).pipe(delay(1000));
  }
}
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../Service/admin.service';
import { NotificationService } from '../../Service/notification.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService);

  currentTab: 'bookings' | 'users' | 'revenue' | 'teachers' = 'bookings';
  isLoading = false;

  startDate = '';
  endDate = '';

  bookingStats = {
    total: 0,
    confirmed: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    topSubjects: [] as any[]
  };

  userStats = {
    totalUsers: 0,
    newThisMonth: 0,
    students: 0,
    teachers: 0,
    admins: 0,
    byRole: [] as any[]
  };

  revenueStats = {
    totalRevenue: 0,
    monthlyRevenue: [] as any[],
    byTeacher: [] as any[],
    commission: 0
  };

  teacherStats = {
    topTeachers: [] as any[],
    averageRating: 0,
    completionRate: 0,
    earningsLeaderboard: [] as any[]
  };

  ngOnInit(): void {
    this.initializeDefaultDates();
    this.loadReports();
  }

  private initializeDefaultDates(): void {
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth() - 1, end.getDate());
    
    this.endDate = end.toISOString().split('T')[0];
    this.startDate = start.toISOString().split('T')[0];
  }

  private loadReports(): void {
    this.isLoading = true;

    this.adminService.getBookingStats('monthly').subscribe({
      next: (stats) => {
        this.bookingStats = {
          ...stats,
          topSubjects: [
            { subject: 'Mathematics', count: 145 },
            { subject: 'Science', count: 132 },
            { subject: 'English', count: 128 }
          ]
        };
      }
    });

    this.adminService.getUserStats('monthly').subscribe({
      next: (stats) => {
        this.userStats = stats;
      }
    });

    this.adminService.getRevenueStats('monthly').subscribe({
      next: (stats) => {
        this.revenueStats = stats;
      }
    });

    this.adminService.getTeacherPerformanceStats().subscribe({
      next: (stats) => {
        this.teacherStats = stats;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load reports');
        this.isLoading = false;
      }
    });
  }

  onDateChange(): void {
    this.loadReports();
  }

  exportBookingReport(format: 'pdf' | 'excel'): void {
    this.adminService.exportBookingReport(format).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `booking-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
        this.notificationService.showSuccess('Report exported successfully');
      },
      error: () => {
        this.notificationService.showError('Failed to export report');
      }
    });
  }

  exportUserReport(format: 'pdf' | 'excel'): void {
    this.adminService.exportUserReport(format).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `user-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
        this.notificationService.showSuccess('Report exported successfully');
      },
      error: () => {
        this.notificationService.showError('Failed to export report');
      }
    });
  }

  exportRevenueReport(format: 'pdf' | 'excel'): void {
    this.adminService.exportRevenueReport(format).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `revenue-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
        this.notificationService.showSuccess('Report exported successfully');
      },
      error: () => {
        this.notificationService.showError('Failed to export report');
      }
    });
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getConfirmationPercentage(): number {
    const total = this.bookingStats.total || 1;
    return Math.round((this.bookingStats.confirmed / total) * 100);
  }

  getCompletionPercentage(): number {
    const total = this.bookingStats.total || 1;
    return Math.round((this.bookingStats.completed / total) * 100);
  }
}
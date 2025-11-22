import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';
import { AdminService, DashboardStats } from '../../core/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  stats: DashboardStats = {
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    averageRating: 0
  };

  recentActivities: any[] = [];
  bookingTrends: any[] = [];
  userGrowth: any[] = [];
  revenueData: any[] = [];
  topTeachers: any[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.isLoading = true;

    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.generateMockCharts();
        this.loadActivities();
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load dashboard');
        this.isLoading = false;
      }
    });
  }

  private generateMockCharts(): void {
    this.bookingTrends = [
      { month: 'Jan', bookings: 120 },
      { month: 'Feb', bookings: 150 },
      { month: 'Mar', bookings: 180 },
      { month: 'Apr', bookings: 160 },
      { month: 'May', bookings: 200 },
      { month: 'Jun', bookings: 220 }
    ];

    this.userGrowth = [
      { month: 'Jan', students: 45, teachers: 12 },
      { month: 'Feb', students: 62, teachers: 18 },
      { month: 'Mar', students: 88, teachers: 25 },
      { month: 'Apr', students: 110, teachers: 32 },
      { month: 'May', students: 145, teachers: 42 },
      { month: 'Jun', students: 180, teachers: 55 }
    ];

    this.revenueData = [
      { month: 'Jan', revenue: 45000 },
      { month: 'Feb', revenue: 52000 },
      { month: 'Mar', revenue: 61000 },
      { month: 'Apr', revenue: 58000 },
      { month: 'May', revenue: 72000 },
      { month: 'Jun', revenue: 85000 }
    ];

    // Mock top teachers
    this.topTeachers = [
      { name: 'Mr. Fernando', rating: 4.8, classes: 85 },
      { name: 'Ms. Silva', rating: 4.7, classes: 72 },
      { name: 'Dr. Perera', rating: 4.9, classes: 95 }
    ];
  }

  private loadActivities(): void {
    this.recentActivities = [
      { icon: '??', message: 'New student registered', time: '5 minutes ago' },
      { icon: '??', message: 'Class booking confirmed', time: '15 minutes ago' },
      { icon: '?', message: 'Booking cancelled', time: '1 hour ago' },
      { icon: '?', message: 'Teacher verified', time: '2 hours ago' }
    ];
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}

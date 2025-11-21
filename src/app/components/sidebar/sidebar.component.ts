import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/shared.models';
import { NotificationService } from '../../services/notification.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  currentUser: User | null = null;
  isCollapsed = false;
  menuSections: { title: string; items: MenuItem[] }[] = [];

  private studentMenuItems: MenuItem[] = [
    { icon: 'ðŸ ', label: 'Dashboard', route: '/dashboard/student', roles: ['Student'] },
    { icon: 'ðŸ“š', label: 'Book Class', route: '/book-class', roles: ['Student'] },
    { icon: 'ðŸ“–', label: 'My Bookings', route: '/my-bookings', roles: ['Student'] },
    { icon: 'ðŸŽ“', label: 'Exam Prep', route: '/exam-preparation', roles: ['Student'] },
    { icon: 'ðŸ“„', label: 'Educational Content', route: '/educational-content', roles: ['Student'] }
  ];

  private teacherMenuItems: MenuItem[] = [
    { icon: 'ðŸ ', label: 'Dashboard', route: '/dashboard/teacher', roles: ['Teacher'] },
    { icon: 'ðŸ‘¤', label: 'My Profile', route: '/manage-profile', roles: ['Teacher'] },
    { icon: 'ðŸ“…', label: 'Manage Schedule', route: '/manage-schedule', roles: ['Teacher'] },
    { icon: 'ðŸ‘¥', label: 'My Classes', route: '/my-classes', roles: ['Teacher'] },
    { icon: 'â­', label: 'Reviews & Ratings', route: '/reviews-ratings', roles: ['Teacher'] },
    { icon: 'ðŸ“¤', label: 'Upload Resources', route: '/resources-upload', roles: ['Teacher'] }
  ];

  private adminMenuItems: MenuItem[] = [
    { icon: 'ðŸ ', label: 'Dashboard', route: '/dashboard/admin', roles: ['Admin'] },
    { icon: 'ðŸ‘¥', label: 'User Management', route: '/admin/users', roles: ['Admin'] },
    { icon: 'ðŸ“…', label: 'Timetable', route: '/admin/timetable', roles: ['Admin'] },
    { icon: 'ðŸ“Š', label: 'Reports', route: '/admin/reports', roles: ['Admin'] },
    { icon: 'âš™ï¸', label: 'Settings', route: '/admin/settings', roles: ['Admin'] }
  ];

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.updateMenu();
    });

    if (this.isBrowser && window.innerWidth <= 1024) {
      this.isCollapsed = true;
    }
  }

  private updateMenu(): void {
    if (!this.currentUser) {
      this.menuSections = [];
      return;
    }

    const role = this.currentUser.role;
    let menuItems: MenuItem[] = [];

    switch (role) {
      case 'Student':
        menuItems = this.studentMenuItems;
        break;
      case 'Teacher':
        menuItems = this.teacherMenuItems;
        break;
      case 'Admin':
        menuItems = this.adminMenuItems;
        break;
    }

    this.menuSections = [
      {
        title: 'Main Menu',
        items: menuItems.filter(item => item.roles.includes(role))
      }
    ];
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  openSupport(): void {
    this.router.navigate(['/support']);
  }
}

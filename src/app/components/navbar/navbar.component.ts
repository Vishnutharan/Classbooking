import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/shared.models';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  private clickListener?: (event: MouseEvent) => void;

  currentUser: User | null = null;
  searchQuery = '';
  isDarkMode = false;
  showNotifications = false;
  showUserMenu = false;
  notificationCount = 3;

  notifications = [
    { icon: '📚', title: 'New class booked with Mr. Perera', time: '5 minutes ago' },
    { icon: '⭐', title: 'Your profile was verified', time: '1 hour ago' },
    { icon: '💬', title: 'New message from student', time: '2 hours ago' }
  ];

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    if (this.isBrowser) {
      this.clickListener = (event: MouseEvent) => this.handleDocumentClick(event);
      document.addEventListener('click', this.clickListener as EventListener);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.clickListener) {
      document.removeEventListener('click', this.clickListener as EventListener);
    }
  }

  private handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-wrapper')) {
      this.showNotifications = false;
    }
    if (!target.closest('.user-wrapper')) {
      this.showUserMenu = false;
    }
  }

  navigate(path: string): void {
    this.showUserMenu = false;
    this.router.navigate([path]);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.notificationService.showInfo(`Searching for: ${this.searchQuery}`);
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.notificationService.showInfo(`${this.isDarkMode ? 'Dark' : 'Light'} mode activated`);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  clearNotifications(): void {
    this.notifications = [];
    this.notificationCount = 0;
    this.notificationService.showSuccess('Notifications cleared');
  }

  logout(): void {
    this.authService.logout();
  }
}

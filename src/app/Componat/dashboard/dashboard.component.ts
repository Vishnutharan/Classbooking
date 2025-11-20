import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService, User } from '../../Service/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
    templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser: User | null = null;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.redirectToRoleDashboard(user.role);
      }
    });
  }

  private redirectToRoleDashboard(role: string): void {
    const currentPath = this.router.url;
    if (currentPath === '/dashboard') {
      switch (role) {
        case 'Student':
          this.router.navigate(['/dashboard/student']);
          break;
        case 'Teacher':
          this.router.navigate(['/dashboard/teacher']);
          break;
        case 'Admin':
          this.router.navigate(['/dashboard/admin']);
          break;
      }
    }
  }

  hasActiveChildRoute(): boolean {
    return this.router.url !== '/dashboard';
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  navigateToProfile(): void {
    this.router.navigate(['/manage-profile']);
  }

  logout(): void {
    this.authService.logout();
  }
}
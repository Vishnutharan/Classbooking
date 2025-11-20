import { Routes } from '@angular/router';
import { AuthGuard } from './AuthGuard/auth.guard';
import { RoleGuard } from './AuthGuard/role.guard';
import { RenderMode, ServerRoute } from '@angular/ssr';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./Componat/auth/auth.component').then(m => m.AuthComponent),
    data: { title: 'Authentication' }
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./Componat/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'dashboard/student',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    loadComponent: () => import('./Componat/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'book-class',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    loadComponent: () => import('./Componat/book-class/book-class.component').then(m => m.BookClassComponent)
  },
  {
    path: 'my-bookings',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student', 'Teacher'] },
    loadComponent: () => import('./Componat/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent)
  },
  {
    path: 'exam-preparation',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    loadComponent: () => import('./Componat/exam-preparation/exam-preparation.component').then(m => m.ExamPreparationComponent)
  },
  {
    path: 'educational-content',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    loadComponent: () => import('./Componat/educational-content/educational-content.component').then(m => m.EducationalContentComponent)
  },
  {
    path: 'teacher-profile/:id',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student', 'Teacher', 'Admin'] },
    loadComponent: () => import('./Componat/teacher-profile/teacher-profile.component').then(m => m.TeacherProfileComponent)
  },
  {
    path: 'manage-profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./Componat/teacher-profile/teacher-profile.component').then(m => m.TeacherProfileComponent)
  },
  {
    path: 'dashboard/teacher',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () => import('./Componat/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'manage-schedule',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () => import('./Componat/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'my-classes',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () => import('./Componat/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent)
  },
  {
    path: 'reviews-ratings',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () => import('./Componat/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'resources-upload',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () => import('./Componat/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'dashboard/admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () => import('./Componat/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'admin/users',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () => import('./Componat/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'admin/timetable',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () => import('./Componat/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'admin/reports',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () => import('./Componat/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'admin/settings',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () => import('./Componat/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadComponent: () => import('./Componat/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'support',
    canActivate: [AuthGuard],
    loadComponent: () => import('./Componat/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  }
];
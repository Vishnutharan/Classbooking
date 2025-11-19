import { Routes } from '@angular/router';
import { AuthGuard } from './AuthGuard/auth.guard';
import { RoleGuard } from './AuthGuard/role.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  // {
  //   path: 'auth',
  //   loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent),
  //   data: { title: 'Authentication' }
  // },
  // {
  //   path: 'dashboard',
  //   canActivate: [AuthGuard],
  //   loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  //   children: [
  //     {
  //       path: 'student',
  //       canActivate: [RoleGuard],
  //       data: { roles: ['Student'] },
  //       loadComponent: () => import('./features/student/student-dashboard.component').then(m => m.StudentDashboardComponent)
  //     },
  //     {
  //       path: 'teacher',
  //       canActivate: [RoleGuard],
  //       data: { roles: ['Teacher'] },
  //       loadComponent: () => import('./features/teacher/teacher-dashboard.component').then(m => m.TeacherDashboardComponent)
  //     },
  //     {
  //       path: 'admin',
  //       canActivate: [RoleGuard],
  //       data: { roles: ['Admin'] },
  //       loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  //     }
  //   ]
  // },
  // {
  //   path: 'book-class',
  //   canActivate: [AuthGuard, RoleGuard],
  //   data: { roles: ['Student'] },
  //   loadComponent: () => import('./features/student/book-class/book-class.component').then(m => m.BookClassComponent)
  // },
  // {
  //   path: 'my-bookings',
  //   canActivate: [AuthGuard],
  //   loadComponent: () => import('./features/bookings/my-bookings.component').then(m => m.MyBookingsComponent)
  // },
  // {
  //   path: 'teacher-profile/:id',
  //   canActivate: [AuthGuard],
  //   loadComponent: () => import('./features/teacher/teacher-profile/teacher-profile.component').then(m => m.TeacherProfileComponent)
  // },
  // {
  //   path: 'manage-profile',
  //   canActivate: [AuthGuard],
  //   loadComponent: () => import('./features/profile/manage-profile.component').then(m => m.ManageProfileComponent)
  // },
  // {
  //   path: 'exam-preparation',
  //   canActivate: [AuthGuard, RoleGuard],
  //   data: { roles: ['Student'] },
  //   loadComponent: () => import('./features/student/exam-preparation/exam-preparation.component').then(m => m.ExamPreparationComponent)
  // },
  // {
  //   path: 'educational-content',
  //   canActivate: [AuthGuard],
  //   loadComponent: () => import('./features/content/educational-content.component').then(m => m.EducationalContentComponent)
  // },
  // {
  //   path: 'admin/users',
  //   canActivate: [AuthGuard, RoleGuard],
  //   data: { roles: ['Admin'] },
  //   loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
  // },
  // {
  //   path: 'admin/timetable',
  //   canActivate: [AuthGuard, RoleGuard],
  //   data: { roles: ['Admin'] },
  //   loadComponent: () => import('./features/admin/timetable/timetable.component').then(m => m.TimetableComponent)
  // },
  // {
  //   path: 'admin/reports',
  //   canActivate: [AuthGuard, RoleGuard],
  //   data: { roles: ['Admin'] },
  //   loadComponent: () => import('./features/admin/reports/reports.component').then(m => m.ReportsComponent)
  // },
  // {
  //   path: '**',
  //   loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  // }
];
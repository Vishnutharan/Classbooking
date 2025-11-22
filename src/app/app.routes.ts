import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./components/auth/auth.component').then(m => m.AuthComponent),
    data: { title: 'Authentication' }
  },

  // COMMON DASHBOARD
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      )
  },

  // STUDENT ROUTES
  {
    path: 'dashboard/student',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    loadComponent: () =>
      import('./components/student-dashboard/student-dashboard.component').then(
        m => m.StudentDashboardComponent
      )
  },
  {
    path: 'book-class',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    loadComponent: () =>
      import('./components/book-class/book-class.component').then(
        m => m.BookClassComponent
      )
  },
  {
    path: 'my-bookings',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student', 'Teacher'] },
    loadComponent: () =>
      import('./components/my-bookings/my-bookings.component').then(
        m => m.MyBookingsComponent
      )
  },
  {
    path: 'exam-preparation',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    loadComponent: () =>
      import(
        './components/exam-preparation/exam-preparation.component'
      ).then(m => m.ExamPreparationComponent)
  },
  {
    path: 'exam-materials',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    loadComponent: () =>
      import(
        './components/exam-materials/exam-materials.component'
      ).then(m => m.ExamMaterialsComponent)
  },
  {
    path: 'past-papers',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    loadComponent: () =>
      import(
        './components/past-papers/past-papers.component'
      ).then(m => m.PastPapersComponent)
  },
  {
    path: 'educational-content',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    loadComponent: () =>
      import(
        './components/educational-content/educational-content.component'
      ).then(m => m.EducationalContentComponent)
  },
  {
    path: 'student/progress',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    loadComponent: () =>
      import('./components/student-progress-tracker/student-progress-tracker.component').then(
        m => m.StudentProgressTrackerComponent
      )
  },
  {
    path: 'my-reviews',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    loadComponent: () =>
      import('./components/reviews-ratings/reviews-ratings.component').then(
        m => m.ReviewsRatingsComponent
      )
  },

  // TEACHER & STUDENT PROFILE
  {
    path: 'teacher-profile/:id',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student', 'Teacher', 'Admin'] },
    loadComponent: () =>
      import('./components/teacher-profile/teacher-profile.component').then(
        m => m.TeacherProfileComponent
      )
  },

  // TEACHER ROUTES
  {
    path: 'dashboard/teacher',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () =>
      import('./components/teacher-dashboard/teacher-dashboard.component').then(
        m => m.TeacherDashboardComponent
      )
  },

  // âœ… UPDATED: Swapped old ManageProfile for your new 'Generic' one
  {
    path: 'manage-profile',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher', 'Student'] },
    loadComponent: () =>
      import('./components/manage-profile/manage-profile.component').then(
        m => m.ManageProfileComponent
      )
  },

  {
    path: 'manage-schedule',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () =>
      import('./components/manage-schedule/manage-schedule.component').then(
        m => m.ManageScheduleComponent
      )
  },
  {
    path: 'my-classes',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () =>
      import('./components/my-classes/my-classes.component').then(
        m => m.MyClassesComponent
      )
  },
  {
    path: 'reviews-ratings',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () =>
      import('./components/reviews-ratings/reviews-ratings.component').then(
        m => m.ReviewsRatingsComponent
      )
  },
  {
    path: 'resources-upload',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () =>
      import('./components/resources-upload/resources-upload.component').then(
        m => m.ResourcesUploadComponent
      )
  },

  // NEW TEACHER FEATURE ROUTES
  {
    path: 'teacher/attendance',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () =>
      import('./components/teacher-attendance/teacher-attendance.component').then(
        m => m.TeacherAttendanceComponent
      )
  },
  {
    path: 'teacher/students',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () =>
      import('./components/teacher-students/teacher-students.component').then(
        m => m.TeacherStudentsComponent
      )
  },
  {
    path: 'teacher/lesson-planner',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () =>
      import('./components/lesson-planner/lesson-planner.component').then(
        m => m.LessonPlannerComponent
      )
  },
  {
    path: 'teacher/analytics',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () =>
      import('./components/teacher-analytics/teacher-analytics.component').then(
        m => m.TeacherAnalyticsComponent
      )
  },
  {
    path: 'teacher/messages',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () =>
      import('./components/teacher-messages/teacher-messages.component').then(
        m => m.TeacherMessagesComponent
      )
  },

  // ADMIN ROUTES
  {
    path: 'dashboard/admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./components/admin-dashboard/admin-dashboard.component').then(
        m => m.AdminDashboardComponent
      )
  },
  {
    path: 'admin/users',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./components/user-management/user-management.component').then(
        m => m.UserManagementComponent
      )
  },
  {
    path: 'admin/timetable',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./components/timetable-management/timetable-management.component').then(
        m => m.TimetableManagementComponent
      )
  },
  {
    path: 'admin/reports',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./components/reports/reports.component').then(
        m => m.ReportsComponent
      )
  },
  {
    path: 'admin/reports/view',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./components/admin-reports-viewer/admin-reports-viewer.component').then(
        m => m.AdminReportsViewerComponent
      )
  },
  {
    path: 'admin/settings',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./components/system-settings/system-settings.component').then(
        m => m.SystemSettingsComponent
      )
  },
  {
    path: 'admin/fees',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./components/fee-management/fee-management.component').then(
        m => m.FeeManagementComponent
      )
  },
  {
    path: 'admin/exams',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./components/exam-results/exam-results.component').then(
        m => m.ExamResultsComponent
      )
  },

  // MISC
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadComponent: () =>
      // Note: You might want to point this to ManageProfileGeneric too?
      import('./components/student-dashboard/student-dashboard.component').then(
        m => m.StudentDashboardComponent
      )
  },
  {
    path: 'support',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/student-dashboard/student-dashboard.component').then(
        m => m.StudentDashboardComponent
      )
  }
];

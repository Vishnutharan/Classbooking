// src/app/app.routes.server.ts

import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Disable prerender for all routes that require API calls.
 * Use SSR runtime only for these routes.
 */
export const serverRoutes: ServerRoute[] = [
  // Student Dashboards
  { path: 'dashboard', renderMode: RenderMode.Server },
  { path: 'dashboard/student', renderMode: RenderMode.Server },

  // Teacher Dashboards & Components
  { path: 'dashboard/teacher', renderMode: RenderMode.Server },
  { path: 'manage-profile', renderMode: RenderMode.Server },
  { path: 'manage-schedule', renderMode: RenderMode.Server },
  { path: 'my-classes', renderMode: RenderMode.Server },
  { path: 'reviews-ratings', renderMode: RenderMode.Server },
  { path: 'resources-upload', renderMode: RenderMode.Server },

  // Student Bookings & Learning
  { path: 'my-bookings', renderMode: RenderMode.Server },
  { path: 'book-class', renderMode: RenderMode.Server },
  { path: 'exam-preparation', renderMode: RenderMode.Server },
  { path: 'educational-content', renderMode: RenderMode.Server },

  // Teacher & Student Profiles
  { path: 'teacher-profile/:id', renderMode: RenderMode.Server },

  // Misc pages calling APIs
  { path: 'support', renderMode: RenderMode.Server },
  { path: 'settings', renderMode: RenderMode.Server },

  // ADMIN ROUTES
  { path: 'admin/users', renderMode: RenderMode.Server },
  { path: 'admin/timetable', renderMode: RenderMode.Server },
  { path: 'admin/reports', renderMode: RenderMode.Server },
  { path: 'admin/settings', renderMode: RenderMode.Server },
  { path: 'dashboard/admin', renderMode: RenderMode.Server },

  // Anything else can be prerendered
  { path: '**', renderMode: RenderMode.Prerender }
];
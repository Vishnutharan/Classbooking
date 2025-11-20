import { Routes } from '@angular/router';
import { AuthGuard } from './AuthGuard/auth.guard';
import { RoleGuard } from './AuthGuard/role.guard';

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
  }
];
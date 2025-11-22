import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Allow access during SSR to avoid navigation issues
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const requiredRoles = route.data?.['roles'] as string[];
  const userRole = authService.getUserRole();

  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};

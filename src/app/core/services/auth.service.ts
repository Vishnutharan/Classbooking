// src/app/Service/auth.service.ts

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';
import { DemoDataService } from './demo-data.service';
import { User } from '../models/user.models';
import { LoginRequest, AuthResponse } from '../models/auth.models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private demoDataService = inject(DemoDataService);
  private isBrowser: boolean;

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private apiUrl = 'api/auth';
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private userKey = 'current_user';

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  register(userData: any): Observable<AuthResponse> {
    // Mock register
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      password: userData.password,
      status: 'Active',
      createdAt: new Date()
    };
    this.demoDataService.addUser(newUser);

    const response: AuthResponse = {
      token: 'mock-token',
      refreshToken: 'mock-refresh',
      user: newUser
    };
    this.handleAuthResponse(response);
    return of(response).pipe(tap(() => { }));
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const email = credentials.email.toLowerCase();
    const user = this.demoDataService.getUserByEmail(email);

    if (user && user.password === credentials.password) {
      // Build a fake JWT-like token
      const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours
      const payload = { exp, role: user.role, id: user.id };
      const token = `fake.${btoa(JSON.stringify(payload))}.token`;

      const response: AuthResponse = {
        token,
        refreshToken: 'dev-refresh-token',
        user: user
      };

      this.handleAuthResponse(response);
      return of(response);
    }

    return of({} as AuthResponse).pipe(
      tap(() => {
        throw new Error('Invalid credentials');
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth']);
  }

  refreshToken(): Observable<AuthResponse> {
    // Mock refresh
    const user = this.getCurrentUser();
    if (user) {
      return of({
        token: 'new-mock-token',
        refreshToken: 'new-mock-refresh',
        user
      });
    }
    return of({} as AuthResponse);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  getUserRole(): string | null {
    return this.getCurrentUser()?.role || null;
  }

  // 🔑 Central place to store tokens + user after login / register / refresh
  private handleAuthResponse(response: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, response.token);
      localStorage.setItem(this.refreshTokenKey, response.refreshToken);
      localStorage.setItem(this.userKey, JSON.stringify(response.user));
    }

    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  private getUserFromToken(): User | null {
    if (!this.isBrowser) return null;

    try {
      const userStr = localStorage.getItem(this.userKey);
      return userStr ? JSON.parse(userStr) as User : null;
    } catch {
      return null;
    }
  }

  private hasValidToken(): boolean {
    if (!this.isBrowser) return false;

    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}

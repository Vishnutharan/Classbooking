// src/app/Service/auth.service.ts

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: 'Student' | 'Teacher' | 'Admin';
    profilePicture?: string;
  };
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'Student' | 'Teacher' | 'Admin';
  profilePicture?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
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
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(tap(response => this.handleAuthResponse(response)));
  }

  // 🔐 TEMPORARY DEV LOGIN: hardcoded credentials for each role
  login(credentials: LoginRequest): Observable<AuthResponse> {
    const email = credentials.email.toLowerCase();

    const tempUsers: {
      [email: string]: { password: string; role: 'Student' | 'Teacher' | 'Admin'; fullName: string };
    } = {
      'student@test.com': { password: 'Student@123', role: 'Student', fullName: 'Temporary Student' },
      'teacher@test.com': { password: 'Teacher@123', role: 'Teacher', fullName: 'Temporary Teacher' },
      'admin@test.com':   { password: 'Admin@123',   role: 'Admin',   fullName: 'Temporary Admin' }
    };

    const match = tempUsers[email];

    if (match && credentials.password === match.password) {
      // Build a fake JWT-like token with 1-hour expiry so hasValidToken() passes
      const exp = Math.floor(Date.now() / 1000) + 60 * 60;
      const payload = { exp };
      const token = `fake.${btoa(JSON.stringify(payload))}.token`;

      const response: AuthResponse = {
        token,
        refreshToken: 'dev-refresh-token',
        user: {
          id: `temp-${match.role.toLowerCase()}`,
          email: credentials.email,
          fullName: match.fullName,
          role: match.role,
          profilePicture: ''
        }
      };

      this.handleAuthResponse(response);
      return of(response);
    }

    // 🧑‍💻 Real backend login (kept for later)
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap(response => this.handleAuthResponse(response)));
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
    const refreshToken = this.isBrowser ? localStorage.getItem(this.refreshTokenKey) : null;
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(tap(response => this.handleAuthResponse(response)));
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

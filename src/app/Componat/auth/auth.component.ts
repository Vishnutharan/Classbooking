// src/app/Componat/auth/auth.component.ts

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, AuthResponse, LoginRequest } from '../../Service/auth.service';
import { NotificationService } from '../../Service/notification.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  authForm!: FormGroup;
  isLoginMode = true;
  isLoading = false;
  errorMessage: string | null = null;
  returnUrl = '/dashboard';
  showPassword = false; // used in template

  ngOnInit(): void {
    // read returnUrl from query params (set by AuthGuard)
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';

    // form fields used in your HTML
    this.authForm = this.fb.group({
      fullName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
      role: ['Student', Validators.required]
    });
  }

  get email() {
    return this.authForm.get('email');
  }

  get password() {
    return this.authForm.get('password');
  }

  /** Toggle between login and register modes */
  toggleMode(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = null;
  }

  /** Demo credentials buttons in the template */
  useDemoCredentials(role: 'Student' | 'Teacher' | 'Admin'): void {
    this.isLoginMode = true;

    const demoMap: Record<'Student' | 'Teacher' | 'Admin', { email: string; password: string }> = {
      Student: { email: 'student@test.com', password: 'Student@123' },
      Teacher: { email: 'teacher@test.com', password: 'Teacher@123' },
      Admin:   { email: 'admin@test.com',   password: 'Admin@123' }
    };

    const creds = demoMap[role];

    this.authForm.patchValue({
      email: creds.email,
      password: creds.password
    });

    this.notificationService.showInfo(`${role} demo credentials loaded.`);
  }

  /** Show/hide password in template */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValue = this.authForm.value;

    if (this.isLoginMode) {
      const credentials: LoginRequest = {
        email: formValue.email,
        password: formValue.password
      };

      this.authService.login(credentials).subscribe({
        next: (response: AuthResponse) => {
          this.notificationService.showSuccess('Logged in successfully!');

          const role = response.user.role;

          // default target route by role
          let defaultRoute = '/dashboard';
          if (role === 'Student') {
            defaultRoute = '/dashboard/student';
          } else if (role === 'Teacher') {
            defaultRoute = '/dashboard/teacher';
          } else if (role === 'Admin') {
            defaultRoute = '/dashboard/admin';
          }

          // avoid redirecting back to /auth as returnUrl
          const target =
            this.returnUrl && this.returnUrl !== '/auth'
              ? this.returnUrl
              : defaultRoute;

          this.router.navigate([target]);
        },
        error: (error) => {
          const msg =
            error?.error?.message ||
            error?.message ||
            'Login failed. Please try again.';
          this.errorMessage = msg;
          this.notificationService.showError(msg);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      // Register mode
      const { confirmPassword, ...registerData } = formValue;

      if (registerData.password !== confirmPassword) {
        const msg = 'Passwords do not match.';
        this.errorMessage = msg;
        this.notificationService.showError(msg);
        this.isLoading = false;
        return;
      }

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Account created successfully!');
          const role = response.user.role;
          let defaultRoute = '/dashboard';
          if (role === 'Student') {
            defaultRoute = '/dashboard/student';
          } else if (role === 'Teacher') {
            defaultRoute = '/dashboard/teacher';
          } else if (role === 'Admin') {
            defaultRoute = '/dashboard/admin';
          }
          this.router.navigate([defaultRoute]);
        },
        error: (error) => {
          const msg =
            error?.error?.message ||
            error?.message ||
            'Registration failed. Please try again.';
          this.errorMessage = msg;
          this.notificationService.showError(msg);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.notificationService.showInfo('Password reset functionality will be available soon.');
  }

  onSocialLogin(provider: string): void {
    this.notificationService.showInfo(`${provider} login will be available soon.`);
  }
}

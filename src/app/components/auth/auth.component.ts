// src/app/Componat/auth/auth.component.ts

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { AuthResponse, LoginRequest } from '../../core/models/auth.models';
import { NotificationService } from '../../core/services/notification.service';

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
  showPassword = false;

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';

    this.authForm = this.fb.group({
      fullName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
      role: ['Student', Validators.required]
    });
  }

  toggleMode(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = null;
  }



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

          let defaultRoute = '/dashboard';
          if (role === 'Student') {
            defaultRoute = '/dashboard/student';
          } else if (role === 'Teacher') {
            defaultRoute = '/dashboard/teacher';
          } else if (role === 'Admin') {
            defaultRoute = '/dashboard/admin';
          }

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

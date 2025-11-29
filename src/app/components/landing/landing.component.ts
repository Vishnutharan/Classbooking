import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/shared.models';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: User | null = null;
  isAuthenticated = false;

  // Features data
  features = [
    {
      icon: '📚',
      title: 'Book Classes',
      description: 'Find and book classes with qualified teachers across various subjects.'
    },
    {
      icon: '👨‍🏫',
      title: 'Expert Teachers',
      description: 'Connect with experienced educators who are passionate about teaching.'
    },
    {
      icon: '📅',
      title: 'Flexible Scheduling',
      description: 'Book classes at times that work best for you with our intuitive calendar.'
    },
    {
      icon: '🎓',
      title: 'Exam Preparation',
      description: 'Access study materials, past papers, and exam preparation resources.'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking and analytics.'
    },
    {
      icon: '💬',
      title: 'Reviews & Ratings',
      description: 'Read authentic reviews from students to find the perfect teacher.'
    }
  ];

  // How it works steps
  studentSteps = [
    {
      number: '1',
      title: 'Create Account',
      description: 'Sign up as a student in just a few clicks.'
    },
    {
      number: '2',
      title: 'Browse Teachers',
      description: 'Search and filter teachers by subject, experience, and ratings.'
    },
    {
      number: '3',
      title: 'Book Classes',
      description: 'Select available time slots and book your class instantly.'
    },
    {
      number: '4',
      title: 'Start Learning',
      description: 'Attend your class and track your progress over time.'
    }
  ];

  teacherSteps = [
    {
      number: '1',
      title: 'Register as Teacher',
      description: 'Create your teacher profile with qualifications and expertise.'
    },
    {
      number: '2',
      title: 'Set Availability',
      description: 'Manage your schedule and set when you\'re available to teach.'
    },
    {
      number: '3',
      title: 'Receive Bookings',
      description: 'Students discover your profile and book your available slots.'
    },
    {
      number: '4',
      title: 'Teach & Earn',
      description: 'Conduct classes and manage your students efficiently.'
    }
  ];

  // Testimonials
  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Student',
      avatar: '👩‍🎓',
      rating: 5,
      text: 'ClassBooking made it easy to find the perfect math tutor. My grades have improved significantly!'
    },
    {
      name: 'David Chen',
      role: 'Teacher',
      avatar: '👨‍🏫',
      rating: 5,
      text: 'As a teacher, this platform has helped me reach more students and manage my schedule efficiently.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Student',
      avatar: '👩‍💼',
      rating: 5,
      text: 'The exam preparation resources are incredible. I passed my exams with flying colors!'
    }
  ];

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  navigateToAuth(mode: 'login' | 'register'): void {
    this.router.navigate(['/auth'], { 
      queryParams: { mode } 
    });
  }

  navigateToDashboard(): void {
    if (this.currentUser) {
      const role = this.currentUser.role;
      switch (role) {
        case 'Student':
          this.router.navigate(['/dashboard/student']);
          break;
        case 'Teacher':
          this.router.navigate(['/dashboard/teacher']);
          break;
        case 'Admin':
          this.router.navigate(['/dashboard/admin']);
          break;
        default:
          this.router.navigate(['/dashboard']);
      }
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  navigateToBookClass(): void {
    this.router.navigate(['/book-class']);
  }

  logout(): void {
    this.authService.logout();
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

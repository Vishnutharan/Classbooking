import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../core/services/student.service';
import { NotificationService } from '../../core/services/notification.service';
import { StudentProfile, UpdateStudentProfileRequest } from '../../core/models/student.models';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent implements OnInit {
  private studentService = inject(StudentService);
  private notificationService = inject(NotificationService);

  profile: StudentProfile | null = null;
  isLoading = false;
  isSaving = false;

  formData = {
    fullName: '',
    phoneNumber: '',
    school: '',
    gradeLevel: 'OLevel',
    parentName: '',
    parentContact: ''
  };

  gradeOptions = ['Primary', 'OLevel', 'ALevel'];

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.studentService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.formData = {
          fullName: profile.fullName || '',
          phoneNumber: profile.phoneNumber || '',
          school: profile.school || '',
          gradeLevel: profile.gradeLevel || 'OLevel',
          parentName: profile.parentName || '',
          parentContact: profile.parentContact || ''
        };
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load profile');
        this.isLoading = false;
      }
    });
  }

  saveProfile(): void {
    if (!this.formData.fullName) {
      this.notificationService.showWarning('Full Name is required');
      return;
    }

    this.isSaving = true;
    
    const request: UpdateStudentProfileRequest = {
      fullName: this.formData.fullName,
      phoneNumber: this.formData.phoneNumber,
      school: this.formData.school,
      gradeLevel: this.formData.gradeLevel as 'Primary' | 'OLevel' | 'ALevel',
      parentName: this.formData.parentName,
      parentContact: this.formData.parentContact
    };

    this.studentService.updateProfile(request).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.notificationService.showSuccess('Profile updated successfully');
        this.isSaving = false;
      },
      error: () => {
        this.notificationService.showError('Failed to update profile');
        this.isSaving = false;
      }
    });
  }
}

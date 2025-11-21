import { Component, inject, OnInit } from '@angular/core';
import { TeacherProfile, TeacherService, TeacherSubject, UpdateTeacherRequest } from '../../services/teacher.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms'; // Added FormsModule
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-profile',
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // Added FormsModule here
  templateUrl: './manage-profile.component.html',
  styleUrl: './manage-profile.component.css'
})
export class ManageProfileComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  profileForm!: FormGroup;
  teacher: TeacherProfile | null = null;
  isLoading = false;
  isSaving = false;
  profilePicture: string | null = null;
  
  // Standalone inputs for array additions
  newQualification = '';
  newSubject: TeacherSubject = { id: '', name: '', medium: 'English', level: 'Primary' };

  subjects: TeacherSubject[] = [];
  qualifications: string[] = [];

  mediums = ['Sinhala', 'Tamil', 'English'];
  levels = ['Primary', 'Secondary', 'Advanced'];

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      bio: [''],
      hourlyRate: ['', [Validators.required, Validators.min(0)]],
      experienceYears: ['', [Validators.required, Validators.min(0)]]
    });
  }

  private loadProfile(): void {
    this.isLoading = true;
    this.teacherService.getMyProfile().subscribe({
      next: (profile) => {
        this.teacher = profile;
        this.subjects = [...profile.subjects];
        this.qualifications = [...profile.qualifications];
        this.profilePicture = profile.profilePicture || null;

        this.profileForm.patchValue({
          fullName: profile.fullName,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          bio: profile.bio,
          hourlyRate: profile.hourlyRate,
          experienceYears: profile.experienceYears
        });

        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load profile');
        this.isLoading = false;
      }
    });
  }

  onProfilePictureChange(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  // Consolidated file handling
  private handleFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profilePicture = e.target.result;
    };
    reader.readAsDataURL(file);

    this.teacherService.uploadProfilePicture(file).subscribe({
      next: () => {
        this.notificationService.showSuccess('Profile picture updated');
      }
    });
  }

  addQualification(): void {
    if (this.newQualification.trim() && !this.qualifications.includes(this.newQualification)) {
      this.qualifications.push(this.newQualification);
      this.newQualification = '';
    }
  }

  removeQualification(index: number): void {
    this.qualifications.splice(index, 1);
  }

  addSubject(): void {
    if (this.newSubject.name.trim()) {
      this.subjects.push({ ...this.newSubject, id: Date.now().toString() });
      // Reset with default values
      this.newSubject = { id: '', name: '', medium: 'English', level: 'Primary' };
    }
  }

  removeSubject(index: number): void {
    this.subjects.splice(index, 1);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.notificationService.showWarning('Please fill all required fields');
      return;
    }

    this.isSaving = true;
    const update: UpdateTeacherRequest = {
      ...this.profileForm.value,
      qualifications: this.qualifications,
      subjects: this.subjects
    };

    this.teacherService.updateProfile(update).subscribe({
      next: () => {
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

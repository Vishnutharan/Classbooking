import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms'; // âœ… Added FormsModule
import { AuthService, User } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-manage-profile-generic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // âœ… Added FormsModule here
  templateUrl: './manage-profile-generic.component.html',
  styleUrl: './manage-profile-generic.component.css'
})
export class ManageProfileGenericComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  privacyForm!: FormGroup;
  
  currentUser: User | null = null;
  isLoading = false;
  isSaving = false;
  
  // âœ… Fix: Typed explicitly to allow null
  profilePicture: string | null = null;
  
  showDeleteModal = false;
  deleteConfirmEmail = '';

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initForms();
    this.loadProfile();
  }

  private initForms(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      // âœ… Note: 'disabled: true' here handles the HTML disabled state automatically
      email: [{ value: '', disabled: true }],
      phoneNumber: [''],
      hourlyRate: [0],
      experienceYears: [0],
      bio: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });

    this.privacyForm = this.fb.group({
      profilePublic: [true],
      showAvailability: [true],
      allowNotifications: [true]
    });
  }

  private loadProfile(): void {
    this.isLoading = true;
    if (this.currentUser) {
      // âœ… Fix: safely cast to any if properties are missing from your User interface
      const user: any = this.currentUser;

      this.profileForm.patchValue({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber || '' 
      });

      // âœ… Fix: Handle undefined vs null mismatch
      this.profilePicture = user.profilePicture || null;
    }
    this.isLoading = false;
  }

  onProfilePictureChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.onProfilePictureChange({ target: { files } });
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.notificationService.showWarning('Please fill required fields');
      return;
    }
    this.isSaving = true;
    
    // Simulate API call
    setTimeout(() => {
      this.notificationService.showSuccess('Profile updated successfully');
      this.isSaving = false;
    }, 1000);
  }

  changePassword(): void {
    if (this.passwordForm.get('newPassword')?.value !== this.passwordForm.get('confirmPassword')?.value) {
      this.notificationService.showError('Passwords do not match');
      return;
    }
    this.isSaving = true;
    setTimeout(() => {
      this.notificationService.showSuccess('Password changed successfully');
      this.passwordForm.reset();
      this.isSaving = false;
    }, 1000);
  }

  savePrivacy(): void {
    this.isSaving = true;
    setTimeout(() => {
      this.notificationService.showSuccess('Privacy settings saved');
      this.isSaving = false;
    }, 1000);
  }

  openDeleteModal(): void {
    this.deleteConfirmEmail = '';
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.deleteConfirmEmail === this.currentUser?.email) {
      this.notificationService.showSuccess('Account deleted');
      this.authService.logout();
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';

interface UploadedResource {
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'Video' | 'Document' | 'Image' | 'Quiz';
  subject: string;
  level: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  isPublic: boolean;
  progress: number;
}

@Component({
  selector: 'app-resources-upload',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './resources-upload.component.html',
  styleUrl: './resources-upload.component.css'
})
export class ResourcesUploadComponent implements OnInit {
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  uploadForm!: FormGroup;
  resources: UploadedResource[] = [];
  isLoading = false;
  isUploading = false;
  uploadProgress = 0;

  fileTypes = ['PDF', 'Video', 'Document', 'Image', 'Quiz'];
  subjects = ['Mathematics', 'Science', 'English', 'Sinhala', 'History', 'Geography'];
  levels = ['Primary', 'Secondary', 'Advanced'];

  selectedFile: File | null = null;
  dragOverActive = false;

  ngOnInit(): void {
    this.initForm();
    this.loadResources();
  }

  private initForm(): void {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      type: ['PDF', Validators.required],
      subject: ['Mathematics', Validators.required],
      level: ['Primary', Validators.required],
      isPublic: [false]
    });
  }

  private loadResources(): void {
    this.isLoading = true;
    // Simulated load - in real app, fetch from service
    setTimeout(() => {
      this.resources = [
        {
          id: '1',
          title: 'Math Chapter 1 Notes',
          description: 'Complete notes for chapter 1',
          type: 'PDF',
          subject: 'Mathematics',
          level: 'Primary',
          fileName: 'math-ch1.pdf',
          fileSize: 2048,
          uploadedAt: new Date(Date.now() - 86400000),
          isPublic: true,
          progress: 100
        }
      ];
      this.isLoading = false;
    }, 500);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.notificationService.showSuccess(`File selected: ${file.name}`);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverActive = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverActive = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverActive = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.notificationService.showSuccess(`File selected: ${files[0].name}`);
    }
  }

  uploadResource(): void {
    if (this.uploadForm.invalid) {
      this.notificationService.showWarning('Please fill all required fields');
      return;
    }

    if (!this.selectedFile) {
      this.notificationService.showWarning('Please select a file to upload');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    const interval = setInterval(() => {
      this.uploadProgress += Math.random() * 30;
      if (this.uploadProgress >= 100) {
        this.uploadProgress = 100;
        clearInterval(interval);
        this.completeUpload();
      }
    }, 300);
  }

  private completeUpload(): void {
    const formValue = this.uploadForm.value;
    const newResource: UploadedResource = {
      id: Date.now().toString(),
      title: formValue.title,
      description: formValue.description,
      type: formValue.type,
      subject: formValue.subject,
      level: formValue.level,
      fileName: this.selectedFile?.name || 'file',
      fileSize: this.selectedFile?.size || 0,
      uploadedAt: new Date(),
      isPublic: formValue.isPublic,
      progress: 100
    };

    this.resources.push(newResource);
    this.notificationService.showSuccess('Resource uploaded successfully');
    this.resetForm();
    this.isUploading = false;
  }

  private resetForm(): void {
    this.uploadForm.reset({
      type: 'PDF',
      subject: 'Mathematics',
      level: 'Primary',
      isPublic: false
    });
    this.selectedFile = null;
    this.uploadProgress = 0;
  }

  editResource(resource: UploadedResource): void {
    this.uploadForm.patchValue({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      subject: resource.subject,
      level: resource.level,
      isPublic: resource.isPublic
    });
    this.notificationService.showInfo('Edit mode activated. Update and re-upload');
  }

  deleteResource(id: string): void {
    if (confirm('Are you sure you want to delete this resource?')) {
      this.resources = this.resources.filter(r => r.id !== id);
      this.notificationService.showSuccess('Resource deleted successfully');
    }
  }

  toggleVisibility(resource: UploadedResource): void {
    resource.isPublic = !resource.isPublic;
    this.notificationService.showSuccess(
      `Resource is now ${resource.isPublic ? 'public' : 'private'}`
    );
  }

  downloadResource(resource: UploadedResource): void {
    this.notificationService.showInfo(`Downloading ${resource.fileName}...`);
  }

  getFileSizeDisplay(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

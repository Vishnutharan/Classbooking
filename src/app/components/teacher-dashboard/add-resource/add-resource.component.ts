import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../../core/services/resource.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-add-resource',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h2 class="text-2xl font-bold mb-4 gradient-text">Upload Resource</h2>
      <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()">
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input formControlName="title" type="text" class="input-field w-full" placeholder="Resource Title">
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea formControlName="description" class="input-field w-full" placeholder="Description"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
           <div>
              <label class="block text-gray-700 text-sm font-bold mb-2">Subject</label>
              <select formControlName="subject" class="input-field w-full">
                <option value="">Select Subject</option>
                <option *ngFor="let subject of subjects" [value]="subject">{{subject}}</option>
              </select>
           </div>
           <div>
              <label class="block text-gray-700 text-sm font-bold mb-2">Level</label>
              <select formControlName="level" class="input-field w-full">
                <option value="">Select Level</option>
                <option *ngFor="let level of levels" [value]="level">{{level}}</option>
              </select>
           </div>
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Assign to Student (Optional)</label>
            <!-- In a real app, this would be a search/dropdown of students the teacher teaches -->
            <input formControlName="studentId" type="text" class="input-field w-full" placeholder="Student ID (Leave empty for public/all)">
            <p class="text-xs text-gray-500 mt-1">*Enter Student ID to make this resource private to them.</p>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">File</label>
          <input type="file" (change)="onFileSelected($event)" class="w-full">
        </div>

        <button type="submit" [disabled]="uploadForm.invalid || !selectedFile" class="btn-primary w-full">
          Upload Resource
        </button>

        <p *ngIf="message" [ngClass]="{'text-green-500': !isError, 'text-red-500': isError}" class="mt-4 text-center">
            {{ message }}
        </p>

      </form>
    </div>
  `,
  styles: [`
    .input-field {
        @apply shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all;
    }
    .btn-primary {
        @apply bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out transform hover:-translate-y-0.5;
    }
    .gradient-text {
        @apply bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600;
    }
  `]
})
export class AddResourceComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  message: string = '';
  isError: boolean = false;

  subjects = ['Mathematics', 'Science', 'English', 'History', 'Physics', 'Chemistry']; // Mock list
  levels = ['Primary', 'Secondary', 'O-Level', 'A-Level']; // Mock list

  constructor(private fb: FormBuilder, private resourceService: ResourceService) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      subject: ['', Validators.required],
      level: ['', Validators.required],
      studentId: ['']
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.uploadForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.uploadForm.get('title')?.value);
      formData.append('description', this.uploadForm.get('description')?.value);
      formData.append('subject', this.uploadForm.get('subject')?.value);
      formData.append('level', this.uploadForm.get('level')?.value);
      
      const studentId = this.uploadForm.get('studentId')?.value;
      if (studentId) {
          formData.append('studentId', studentId);
      }

      formData.append('file', this.selectedFile);

      this.resourceService.uploadResource(formData).subscribe({
        next: (res: any) => {
          this.message = 'Resource uploaded successfully!';
          this.isError = false;
          this.uploadForm.reset();
          this.selectedFile = null;
        },
        error: (err: any) => {
          this.message = 'Failed to upload resource.';
          this.isError = true;
          console.error(err);
        }
      });
    }
  }
}

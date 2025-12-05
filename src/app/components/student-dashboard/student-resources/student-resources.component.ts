import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService, Resource } from '../../../core/services/resource.service';

@Component({
  selector: 'app-student-resources',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h2 class="text-2xl font-bold mb-6 gradient-text">My Resources</h2>
      
      <div *ngIf="loading" class="text-center py-4 text-gray-500">Loading resources...</div>
      
      <div *ngIf="!loading && resources.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
        <p class="text-gray-500">No resources assigned to you yet.</p>
      </div>

      <div *ngIf="resources.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let resource of resources" class="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300 bg-white group">
          <div class="flex items-start justify-between">
            <div class="p-2 rounded-lg" [ngClass]="getIconBackground(resource.type)">
               <span class="text-2xl">{{ getIcon(resource.type) }}</span>
            </div>
            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{{ resource.subject }}</span>
          </div>
          
          <h3 class="font-bold text-lg mt-3 mb-1 text-gray-800 group-hover:text-blue-600 transition-colors">{{ resource.title }}</h3>
          <p class="text-sm text-gray-500 line-clamp-2 mb-3">{{ resource.description || 'No description' }}</p>
          
          <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
             <span class="text-xs text-gray-400">{{ resource.uploadedAt | date:'mediumDate' }}</span>
             <a [href]="resource.filePath" target="_blank" class="download-btn flex items-center text-sm">
                Download
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
             </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gradient-text {
        @apply bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600;
    }
    .download-btn {
        @apply text-blue-600 hover:text-blue-800 font-medium transition-colors px-3 py-1 rounded hover:bg-blue-50;
    }
  `]
})
export class StudentResourcesComponent implements OnInit {
  resources: Resource[] = [];
  loading: boolean = true;

  constructor(private resourceService: ResourceService) { }

  ngOnInit(): void {
    this.resourceService.getStudentResources().subscribe({
      next: (data: Resource[]) => {
        this.resources = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching resources', err);
        this.loading = false;
      }
    });
  }

  getIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'quiz': return '📝';
      default: return '📁';
    }
  }

  getIconBackground(type: string): string {
     switch (type.toLowerCase()) {
      case 'pdf': return 'bg-red-50 text-red-500';
      case 'image': return 'bg-blue-50 text-blue-500';
      case 'video': return 'bg-purple-50 text-purple-500';
      default: return 'bg-gray-50 text-gray-500';
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExamPreparation, Resource, StudentService } from '../../Service/student.service';
import { NotificationService } from '../../Service/notification.service';

@Component({
  selector: 'app-exam-preparation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-preparation.component.html',
  styleUrl: './exam-preparation.component.css'
})
export class ExamPreparationComponent implements OnInit {
  private studentService = inject(StudentService);
  private notificationService = inject(NotificationService);

  selectedExam: 'OLevel' | 'ALevel' | 'Scholarship' = 'OLevel';
  preparations: ExamPreparation[] = [];
  filteredResources: Resource[] = [];
  isLoading = false;

  selectedDifficulty = 'All';
  selectedYear = '';
  searchTerm = '';
  bookmarkedResources: Set<string> = new Set();

  difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  years = [2023, 2022, 2021, 2020, 2019];

  ngOnInit(): void {
    this.loadExamPreparations();
  }

  private loadExamPreparations(): void {
    this.isLoading = true;
    this.studentService.getExamPreparations(this.selectedExam).subscribe({
      next: (preps) => {
        this.preparations = preps;
        this.filterResources();
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load exam materials');
        this.isLoading = false;
      }
    });
  }

  onExamChange(): void {
    this.loadExamPreparations();
  }

  private filterResources(): void {
    let resources: Resource[] = [];

    this.preparations.forEach(prep => {
      resources = resources.concat(prep.resources || []);
    });

    resources = resources.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           r.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = !this.selectedDifficulty || this.selectedDifficulty === 'All';
      const matchesYear = !this.selectedYear || r.type === 'PastPaper';

      return matchesSearch && matchesType && matchesYear;
    });

    this.filteredResources = resources;
  }

  onFilterChange(): void {
    this.filterResources();
  }

  onSearch(): void {
    this.filterResources();
  }

  toggleBookmark(resource: Resource): void {
    if (this.bookmarkedResources.has(resource.id)) {
      this.bookmarkedResources.delete(resource.id);
      this.notificationService.showInfo('Removed from bookmarks');
    } else {
      this.bookmarkedResources.add(resource.id);
      this.notificationService.showSuccess('Added to bookmarks');
    }
  }

  downloadResource(resource: Resource): void {
    this.notificationService.showInfo(`Downloading: ${resource.title}`);
  }

  openResource(resource: Resource): void {
    this.notificationService.showInfo(`Opening: ${resource.title}`);
  }

  getResourceTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'Video': '📹',
      'PDF': '📄',
      'Quiz': '❓',
      'Notes': '📝',
      'PastPaper': '📋'
    };
    return icons[type] || '📦';
  }

  getPreparationsByExam(): ExamPreparation[] {
    return this.preparations;
  }
}
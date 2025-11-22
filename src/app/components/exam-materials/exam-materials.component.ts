import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../core/services/student.service';
import { DemoDataService } from '../../core/services/demo-data.service';
import { Resource, ExamPreparation } from '../../core/models/shared.models';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-exam-materials',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './exam-materials.component.html',
    styleUrl: './exam-materials.component.css'
})
export class ExamMaterialsComponent implements OnInit {
    private studentService = inject(StudentService);
    private demoDataService = inject(DemoDataService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);

    selectedExam: 'OLevel' | 'ALevel' | 'Scholarship' = 'OLevel';
    preparations: ExamPreparation[] = [];
    filteredResources: Resource[] = [];
    isLoading = false;

    selectedResourceType = 'All';
    selectedSubject = 'All';
    searchTerm = '';
    bookmarkedResources: Set<string> = new Set();

    resourceTypes = ['All', 'PDF', 'Video', 'Quiz', 'Notes'];
    subjects: string[] = [];

    ngOnInit(): void {
        this.loadExamMaterials();
    }

    private loadExamMaterials(): void {
        this.isLoading = true;

        // Get exam preparations from demo data
        const allPreps = this.demoDataService.getExamPreparations();
        this.preparations = allPreps.filter((p: ExamPreparation) => p.examType === this.selectedExam);

        // Extract unique subjects
        this.subjects = ['All', ...Array.from(new Set(this.preparations.map(p => p.subject)))];

        this.filterResources();
        this.isLoading = false;
    }

    onExamChange(): void {
        this.selectedSubject = 'All';
        this.loadExamMaterials();
    }

    private filterResources(): void {
        let resources: Resource[] = [];

        this.preparations.forEach(prep => {
            // Filter out Past Papers - only show other materials
            const materialsOnly = (prep.resources || []).filter(r => r.type !== 'PastPaper');
            resources = resources.concat(materialsOnly);
        });

        resources = resources.filter(r => {
            const matchesSearch = r.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                r.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesResourceType = this.selectedResourceType === 'All' || r.type === this.selectedResourceType;
            const matchesSubject = this.selectedSubject === 'All' || this.preparations.find(p =>
                p.resources.includes(r) && p.subject === this.selectedSubject
            );

            return matchesSearch && matchesResourceType && matchesSubject;
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
        // In a real app, this would trigger actual download
    }

    openResource(resource: Resource): void {
        this.notificationService.showInfo(`Opening: ${resource.title}`);
        // In a real app, this would open the resource
    }

    getResourceTypeIcon(type: string): string {
        const icons: { [key: string]: string } = {
            'Video': '🎥',
            'PDF': '📄',
            'Quiz': '❓',
            'Notes': '📝',
            'PastPaper': '📋'
        };
        return icons[type] || '📦';
    }

    getResourcesBySubject(subject: string): Resource[] {
        const prep = this.preparations.find(p => p.subject === subject);
        return prep ? prep.resources.filter(r => r.type !== 'PastPaper') : [];
    }
}

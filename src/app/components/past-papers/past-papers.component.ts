import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { DemoDataService } from '../../services/demo-data.service';
import { Resource, ExamPreparation } from '../../models/shared.models';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-past-papers',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './past-papers.component.html',
    styleUrl: './past-papers.component.css'
})
export class PastPapersComponent implements OnInit {
    private studentService = inject(StudentService);
    private demoDataService = inject(DemoDataService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);

    selectedExam: 'OLevel' | 'ALevel' | 'Scholarship' = 'OLevel';
    preparations: ExamPreparation[] = [];
    filteredPapers: Resource[] = [];
    isLoading = false;

    selectedYear = 'All';
    selectedSubject = 'All';
    searchTerm = '';
    bookmarkedPapers: Set<string> = new Set();

    years = ['All', '2023', '2022', '2021', '2020', '2019'];
    subjects: string[] = [];

    ngOnInit(): void {
        this.loadPastPapers();
    }

    private loadPastPapers(): void {
        this.isLoading = true;

        // Get exam preparations from demo data
        const allPreps = this.demoDataService.getExamPreparations();
        this.preparations = allPreps.filter((p: ExamPreparation) => p.examType === this.selectedExam);

        // Extract unique subjects
        this.subjects = ['All', ...Array.from(new Set(this.preparations.map(p => p.subject)))];

        this.filterPapers();
        this.isLoading = false;
    }

    onExamChange(): void {
        this.selectedSubject = 'All';
        this.loadPastPapers();
    }

    private filterPapers(): void {
        let papers: Resource[] = [];

        this.preparations.forEach(prep => {
            // Only show Past Papers
            const pastPapersOnly = (prep.resources || []).filter(r => r.type === 'PastPaper');
            papers = papers.concat(pastPapersOnly);
        });

        papers = papers.filter(r => {
            const matchesSearch = r.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                r.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesYear = this.selectedYear === 'All' || r.title.includes(this.selectedYear);
            const matchesSubject = this.selectedSubject === 'All' || this.preparations.find(p =>
                p.resources.includes(r) && p.subject === this.selectedSubject
            );

            return matchesSearch && matchesYear && matchesSubject;
        });

        this.filteredPapers = papers;
    }

    onFilterChange(): void {
        this.filterPapers();
    }

    onSearch(): void {
        this.filterPapers();
    }

    toggleBookmark(paper: Resource): void {
        if (this.bookmarkedPapers.has(paper.id)) {
            this.bookmarkedPapers.delete(paper.id);
            this.notificationService.showInfo('Removed from bookmarks');
        } else {
            this.bookmarkedPapers.add(paper.id);
            this.notificationService.showSuccess('Added to bookmarks');
        }
    }

    downloadPaper(paper: Resource): void {
        this.notificationService.showInfo(`Downloading: ${paper.title}`);
        // In a real app, this would trigger actual download
    }

    openPaper(paper: Resource): void {
        this.notificationService.showInfo(`Opening: ${paper.title}`);
        // In a real app, this would open the paper
    }

    getPapersBySubject(subject: string): Resource[] {
        const prep = this.preparations.find(p => p.subject === subject);
        return prep ? prep.resources.filter(r => r.type === 'PastPaper') : [];
    }

    getYearFromTitle(title: string): string {
        const match = title.match(/20\d{2}/);
        return match ? match[0] : 'N/A';
    }
}

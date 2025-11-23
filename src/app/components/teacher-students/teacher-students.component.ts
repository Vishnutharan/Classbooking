import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherDataService } from '../../core/services/teacher-data.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { TeacherStudent, StudentProgress } from '../../core/models/teacher-student-management.models';

@Component({
    selector: 'app-teacher-students',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './teacher-students.component.html',
    styleUrl: './teacher-students.component.css'
})
export class TeacherStudentsComponent implements OnInit {
    private teacherDataService = inject(TeacherDataService);
    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);

    students: TeacherStudent[] = [];
    filteredStudents: TeacherStudent[] = [];
    selectedStudent: TeacherStudent | null = null;
    studentProgress: StudentProgress | null = null;
    isLoading = false;
    searchTerm = '';
    filterSubject = 'all';
    filterGrade = 'all';
    showDetails = false;

    ngOnInit(): void {
        this.loadStudents();
    }

    loadStudents(): void {
        this.isLoading = true;
        const user = this.authService.getCurrentUser();
        if (!user) return;

        this.teacherDataService.getTeacherStudents(user.id).subscribe({
            next: (students) => {
                this.students = students;
                this.filteredStudents = students;
                this.isLoading = false;
            },
            error: () => {
                this.notificationService.showError('Failed to load students');
                this.isLoading = false;
            }
        });
    }

    filterStudents(): void {
        this.filteredStudents = this.students.filter(s => {
            const matchesSearch = s.fullName.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesSubject = this.filterSubject === 'all' || s.subjects.includes(this.filterSubject);
            const matchesGrade = this.filterGrade === 'all' || s.grade === this.filterGrade;
            return matchesSearch && matchesSubject && matchesGrade;
        });
    }

    viewStudentDetails(student: TeacherStudent): void {
        this.selectedStudent = student;
        this.showDetails = true;
        this.loadStudentProgress(student.id);
    }

    loadStudentProgress(studentId: string): void {
        this.teacherDataService.getStudentProgress(studentId).subscribe({
            next: (progress) => {
                this.studentProgress = progress;
            },
            error: () => {
                this.notificationService.showError('Failed to load student progress');
            }
        });
    }

    closeDetails(): void {
        this.showDetails = false;
        this.selectedStudent = null;
        this.studentProgress = null;
    }

    getPerformanceClass(level: string): string {
        return {
            'Excellent': 'performance-excellent',
            'Good': 'performance-good',
            'Average': 'performance-average',
            'Needs Improvement': 'performance-poor'
        }[level] || '';
    }
}

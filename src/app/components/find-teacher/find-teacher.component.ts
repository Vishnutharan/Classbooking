import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherProfile } from '../../core/models/shared.models';
import { TeacherService } from '../../core/services/teacher.service';
import { NotificationService } from '../../core/services/notification.service';

interface TeacherCardView {
  id: string;
  name: string;
  subjects: string;
  grades: string;
  district: string;
  medium: string;
  teachingMode: string;
  classType: string;
  rate: number;
  rating: number;
  profilePicture?: string;
  verified: boolean;
}

@Component({
  selector: 'app-find-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './find-teacher.component.html',
  styleUrl: './find-teacher.component.css'
})
export class FindTeacherComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  filters = {
    subject: '',
    grade: '',
    district: '',
    medium: '',
    teachingMode: '',
    classType: ''
  };

  teacherCards: TeacherCardView[] = [];
  filteredCards: TeacherCardView[] = [];
  isLoading = false;

  subjectOptions: string[] = [];
  gradeOptions = ['Grade 6-9', 'Grade 10-11', 'Grade 12-13', 'Primary', 'All grades'];
  districtOptions = ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kalutara', 'Matara', 'Kurunegala'];
  mediumOptions = ['English', 'Sinhala', 'Tamil', 'Bilingual'];
  teachingModeOptions = ['Online & Physical', 'Online', 'Physical'];
  classTypeOptions = ['Individual & Group classes', 'Individual classes', 'Group classes'];

  ngOnInit(): void {
    this.fetchTeachers();
  }

  fetchTeachers(): void {
    this.isLoading = true;
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers) => {
        this.teacherCards = this.mapToCards(teachers || []);
        this.subjectOptions = this.buildSubjectOptions(teachers || []);
        this.applyFilters(false);
      },
      error: () => {
        this.notificationService.showError('Could not load teachers right now.');
        this.filteredCards = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  refreshList(): void {
    this.fetchTeachers();
  }

  applyFilters(showMessages: boolean = true): void {
    this.filteredCards = this.teacherCards.filter(card => {
      const matchesSubject = !this.filters.subject ||
        card.subjects.toLowerCase().includes(this.filters.subject.toLowerCase());

      const matchesGrade = !this.filters.grade ||
        card.grades.toLowerCase().includes(this.filters.grade.toLowerCase());

      const matchesDistrict = !this.filters.district ||
        card.district === this.filters.district;

      const matchesMedium = !this.filters.medium ||
        card.medium.toLowerCase().includes(this.filters.medium.toLowerCase());

      const matchesMode = !this.filters.teachingMode ||
        card.teachingMode === this.filters.teachingMode;

      const matchesClassType = !this.filters.classType ||
        card.classType === this.filters.classType;

      return (
        matchesSubject &&
        matchesGrade &&
        matchesDistrict &&
        matchesMedium &&
        matchesMode &&
        matchesClassType
      );
    });

    if (!this.filteredCards.length && showMessages) {
      this.notificationService.showInfo('No teachers match those filters yet. Try adjusting a filter.');
    }
  }

  clearFilters(): void {
    this.filters = {
      subject: '',
      grade: '',
      district: '',
      medium: '',
      teachingMode: '',
      classType: ''
    };
    this.filteredCards = [...this.teacherCards];
  }

  viewProfile(teacherId: string): void {
    if (!teacherId) {
      this.notificationService.showInfo('Teacher profile is not available yet.');
      return;
    }
    this.router.navigate(['/teacher-profile', teacherId]);
  }

  private mapToCards(teachers: TeacherProfile[]): TeacherCardView[] {
    const fallbackDistricts = this.districtOptions;

    return teachers.map((teacher, index) => {
      const subjects = this.formatSubjects(teacher);
      const grades = this.getGrades(teacher);
      const medium = this.getMediums(teacher);
      const district = fallbackDistricts[index % fallbackDistricts.length];
      const teachingMode = this.teachingModeOptions[index % this.teachingModeOptions.length];
      const classType = this.classTypeOptions[index % this.classTypeOptions.length];

      return {
        id: teacher.id,
        name: teacher.fullName,
        subjects,
        grades,
        district,
        medium: medium || 'All mediums',
        teachingMode,
        classType,
        rate: teacher.hourlyRate ?? 0,
        rating: teacher.averageRating ?? 0,
        profilePicture: teacher.profilePicture,
        verified: teacher.verificationStatus === 'Verified'
      };
    });
  }

  private formatSubjects(teacher: TeacherProfile): string {
    const subjectNames = (teacher.subjects || []).map(s => s.name).filter(Boolean);
    if (!subjectNames.length) {
      return 'Multiple subjects';
    }
    const uniqueNames = Array.from(new Set(subjectNames));
    return uniqueNames.join(', ');
  }

  private getMediums(teacher: TeacherProfile): string {
    const mediums = (teacher.subjects || [])
      .map(s => s.medium)
      .filter(Boolean);
    const unique = Array.from(new Set(mediums));
    return unique.join(', ');
  }

  private getGrades(teacher: TeacherProfile): string {
    const gradeLabels = new Set<string>();

    (teacher.subjects || []).forEach(sub => {
      switch (sub.level) {
        case 'Primary':
          gradeLabels.add('Primary');
          break;
        case 'Secondary':
          gradeLabels.add('Grade 6-9');
          break;
        case 'OLevel':
          gradeLabels.add('Grade 10-11');
          break;
        case 'ALevel':
        case 'Advanced':
          gradeLabels.add('Grade 12-13');
          break;
        default:
          break;
      }
    });

    if (!gradeLabels.size) {
      gradeLabels.add('All grades');
    }

    return Array.from(gradeLabels).join(', ');
  }

  private buildSubjectOptions(teachers: TeacherProfile[]): string[] {
    const options = new Set<string>();
    teachers.forEach(teacher => {
      (teacher.subjects || []).forEach(sub => {
        if (sub.name) {
          options.add(sub.name);
        }
      });
    });
    return Array.from(options);
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService, ExamSeason, PublicHoliday } from '../../services/admin.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-timetable-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './timetable-management.component.html',
  styleUrl: './timetable-management.component.css'
})
export class TimetableManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  holidays: PublicHoliday[] = [];
  examSeasons: ExamSeason[] = [];
  isLoading = false;

  showHolidayForm = false;
  showExamForm = false;
  editingHolidayId: string | null = null;
  editingExamId: string | null = null;

  holidayForm!: FormGroup;
  examForm!: FormGroup;

  examTypes = ['OLevel', 'ALevel', 'Scholarship'];
  currentTab: 'holidays' | 'exams' = 'holidays';

  ngOnInit(): void {
    this.initForms();
    this.loadTimetable();
  }

  private initForms(): void {
    this.holidayForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      description: ['']
    });

    this.examForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      examType: ['OLevel', Validators.required]
    });
  }

  private loadTimetable(): void {
    this.isLoading = true;

    this.adminService.getPublicHolidays().subscribe({
      next: (holidays) => {
        this.holidays = holidays;
      }
    });

    this.adminService.getExamSeasons().subscribe({
      next: (seasons) => {
        this.examSeasons = seasons;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load timetable');
        this.isLoading = false;
      }
    });
  }

  openHolidayForm(): void {
    this.editingHolidayId = null;
    this.holidayForm.reset();
    this.showHolidayForm = true;
  }

  editHoliday(holiday: PublicHoliday): void {
    this.editingHolidayId = holiday.id;
    this.holidayForm.patchValue({
      name: holiday.name,
      date: new Date(holiday.date).toISOString().split('T')[0],
      description: holiday.description
    });
    this.showHolidayForm = true;
  }

  closeHolidayForm(): void {
    this.showHolidayForm = false;
    this.editingHolidayId = null;
  }

  saveHoliday(): void {
    if (this.holidayForm.invalid) {
      this.notificationService.showWarning('Please fill all required fields');
      return;
    }

    const data = {
      ...this.holidayForm.value,
      date: new Date(this.holidayForm.value.date)
    };

    if (this.editingHolidayId) {
      this.adminService.updatePublicHoliday(this.editingHolidayId, data).subscribe({
        next: () => {
          this.notificationService.showSuccess('Holiday updated');
          this.closeHolidayForm();
          this.loadTimetable();
        },
        error: () => {
          this.notificationService.showError('Failed to update holiday');
        }
      });
    } else {
      this.adminService.createPublicHoliday(data).subscribe({
        next: () => {
          this.notificationService.showSuccess('Holiday created');
          this.closeHolidayForm();
          this.loadTimetable();
        },
        error: () => {
          this.notificationService.showError('Failed to create holiday');
        }
      });
    }
  }

  deleteHoliday(id: string): void {
    if (confirm('Are you sure?')) {
      this.adminService.deletePublicHoliday(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Holiday deleted');
          this.loadTimetable();
        },
        error: () => {
          this.notificationService.showError('Failed to delete holiday');
        }
      });
    }
  }

  openExamForm(): void {
    this.editingExamId = null;
    this.examForm.reset({ examType: 'OLevel' });
    this.showExamForm = true;
  }

  editExam(exam: ExamSeason): void {
    this.editingExamId = exam.id;
    this.examForm.patchValue({
      name: exam.name,
      startDate: new Date(exam.startDate).toISOString().split('T')[0],
      endDate: new Date(exam.endDate).toISOString().split('T')[0],
      examType: exam.examType
    });
    this.showExamForm = true;
  }

  closeExamForm(): void {
    this.showExamForm = false;
    this.editingExamId = null;
  }

  saveExam(): void {
    if (this.examForm.invalid) {
      this.notificationService.showWarning('Please fill all required fields');
      return;
    }

    const data = {
      ...this.examForm.value,
      startDate: new Date(this.examForm.value.startDate),
      endDate: new Date(this.examForm.value.endDate)
    };

    if (this.editingExamId) {
      this.adminService.updateExamSeason(this.editingExamId, data).subscribe({
        next: () => {
          this.notificationService.showSuccess('Exam season updated');
          this.closeExamForm();
          this.loadTimetable();
        },
        error: () => {
          this.notificationService.showError('Failed to update exam season');
        }
      });
    } else {
      this.adminService.createExamSeason(data).subscribe({
        next: () => {
          this.notificationService.showSuccess('Exam season created');
          this.closeExamForm();
          this.loadTimetable();
        },
        error: () => {
          this.notificationService.showError('Failed to create exam season');
        }
      });
    }
  }

  deleteExam(id: string): void {
    if (confirm('Are you sure?')) {
      this.adminService.deleteExamSeason(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Exam season deleted');
          this.loadTimetable();
        },
        error: () => {
          this.notificationService.showError('Failed to delete exam season');
        }
      });
    }
  }

  getCalendarEvents(): any[] {
    const events = [
      ...this.holidays.map(h => ({
        type: 'holiday',
        title: h.name,
        date: new Date(h.date)
      })),
      ...this.examSeasons.map(e => ({
        type: 'exam',
        title: `${e.name} (${e.examType})`,
        date: new Date(e.startDate),
        endDate: new Date(e.endDate)
      }))
    ];
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}

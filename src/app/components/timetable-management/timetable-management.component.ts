import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { ExamSeason, PublicHoliday, TimetableEvent } from '../../core/models/shared.models';
import { NotificationService } from '../../core/services/notification.service';
import { TimetableService } from '../../core/services/timetable.service';

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
  private timetableService = inject(TimetableService);

  holidays: PublicHoliday[] = [];
  examSeasons: ExamSeason[] = [];
  timetableEvents: TimetableEvent[] = [];
  isLoading = false;

  showHolidayForm = false;
  showExamForm = false;
  showEventForm = false;
  editingHolidayId: string | null = null;
  editingExamId: string | null = null;
  editingEventId: string | null = null;

  holidayForm!: FormGroup;
  examForm!: FormGroup;
  eventForm!: FormGroup;

  examTypes = ['OLevel', 'ALevel', 'Scholarship'];
  currentTab: 'holidays' | 'exams' = 'holidays';
  eventAudience = ['All', 'Teachers', 'Students'];

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

    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['09:00', Validators.required],
      endTime: ['10:00', Validators.required],
      type: ['General', Validators.required],
      audience: ['All', Validators.required],
      description: ['']
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
        this.loadEvents();
      },
      error: () => {
        this.notificationService.showError('Failed to load timetable');
        this.isLoading = false;
      }
    });
  }

  private loadEvents(): void {
    this.timetableService.getAllTimetable().subscribe({
      next: (events) => {
        this.timetableEvents = events || [];
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load timetable events');
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

  openEventForm(): void {
    this.editingEventId = null;
    this.eventForm.reset({
      title: '',
      date: '',
      startTime: '09:00',
      endTime: '10:00',
      type: 'General',
      audience: 'All',
      description: ''
    });
    this.showEventForm = true;
  }

  editEvent(event: TimetableEvent): void {
    this.editingEventId = event.id;
    this.eventForm.patchValue({
      title: event.title,
      date: new Date(event.date).toISOString().split('T')[0],
      startTime: event.startTime,
      endTime: event.endTime,
      type: event.type || 'General',
      audience: event.audience || 'All',
      description: event.description || ''
    });
    this.showEventForm = true;
  }

  closeEventForm(): void {
    this.showEventForm = false;
    this.editingEventId = null;
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

  saveEvent(): void {
    if (this.eventForm.invalid) {
      this.notificationService.showWarning('Please fill all required fields');
      return;
    }

    const payload: Partial<TimetableEvent> = {
      ...this.eventForm.value,
      date: new Date(this.eventForm.value.date)
    };

    if (this.editingEventId) {
      this.timetableService.updateEvent(this.editingEventId, payload).subscribe({
        next: () => {
          this.notificationService.showSuccess('Event updated');
          this.closeEventForm();
          this.loadEvents();
        },
        error: () => this.notificationService.showError('Failed to update event')
      });
    } else {
      this.timetableService.createEvent(payload).subscribe({
        next: () => {
          this.notificationService.showSuccess('Event created');
          this.closeEventForm();
          this.loadEvents();
        },
        error: () => this.notificationService.showError('Failed to create event')
      });
    }
  }

  deleteEvent(id: string): void {
    if (confirm('Delete this event?')) {
      this.timetableService.deleteEvent(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Event deleted');
          this.loadEvents();
        },
        error: () => this.notificationService.showError('Failed to delete event')
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
      })),
      ...this.timetableEvents.map(ev => ({
        type: ev.type || 'event',
        title: ev.title,
        date: new Date(ev.date),
        startTime: ev.startTime,
        endTime: ev.endTime,
        audience: ev.audience
      }))
    ];
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}

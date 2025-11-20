import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../Service/notification.service';
import { TeacherAvailability, TeacherService } from '../../Service/teacher.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-schedule.component.html',
  styleUrl: './manage-schedule.component.css'
})
export class ManageScheduleComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private notificationService = inject(NotificationService);

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Allow undefined so optional chaining (?.) in the template is valid
  availability: { [key: string]: TeacherAvailability | undefined } = {};

  isLoading = false;
  isSaving = false;

  selectedDaysForCopy: string[] = [];
  copyFromDay = 'Monday';

  ngOnInit(): void {
    this.loadSchedule();
  }

  private loadSchedule(): void {
    this.isLoading = true;
    this.teacherService.getMyProfile().subscribe({
      next: (profile) => {
        this.days.forEach(day => {
          const slot = profile.availability.find((a: TeacherAvailability) => a.dayOfWeek === day);
          this.availability[day] = slot || {
            dayOfWeek: day,
            startTime: '09:00',
            endTime: '17:00'
          };
        });
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load schedule');
        this.isLoading = false;
      }
    });
  }

  updateSlot(day: string, field: 'startTime' | 'endTime', value: string): void {
    const slot = this.availability[day];
    if (slot) {
      slot[field] = value;
    }
  }

  getHoursForDay(day: string): number {
    const slot = this.availability[day];
    if (!slot) return 0;

    const [startHourStr] = slot.startTime.split(':');
    const [endHourStr] = slot.endTime.split(':');

    const startHour = parseInt(startHourStr, 10);
    const endHour = parseInt(endHourStr, 10);

    if (Number.isNaN(startHour) || Number.isNaN(endHour)) return 0;

    const diff = endHour - startHour;
    return diff >= 0 ? diff : 0;
  }

  toggleDay(day: string): void {
    const index = this.selectedDaysForCopy.indexOf(day);
    if (index > -1) {
      this.selectedDaysForCopy.splice(index, 1);
    } else {
      this.selectedDaysForCopy.push(day);
    }
  }

  copyAvailability(): void {
    if (!this.copyFromDay || this.selectedDaysForCopy.length === 0) {
      this.notificationService.showWarning('Select source day and target days');
      return;
    }

    const sourceSlot = this.availability[this.copyFromDay];
    if (!sourceSlot) {
      this.notificationService.showWarning('Source day has no availability');
      return;
    }

    this.selectedDaysForCopy.forEach(day => {
      this.availability[day] = {
        ...sourceSlot,
        dayOfWeek: day
      };
    });

    this.notificationService.showSuccess('Availability copied successfully');
    this.selectedDaysForCopy = [];
  }

  saveSchedule(): void {
    this.isSaving = true;
    const slots = Object.values(this.availability).filter(
      (slot): slot is TeacherAvailability => slot !== undefined
    );

    this.teacherService.updateAvailability(slots).subscribe({
      next: () => {
        this.notificationService.showSuccess('Schedule updated successfully');
        this.isSaving = false;
      },
      error: () => {
        this.notificationService.showError('Failed to update schedule');
        this.isSaving = false;
      }
    });
  }

  getSlotDisplay(day: string): string {
    const slot = this.availability[day];
    return slot ? `${slot.startTime} - ${slot.endTime}` : 'Not set';
  }
}

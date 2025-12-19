import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TimetableService } from '../../core/services/timetable.service';
import { TimetableEvent } from '../../core/models/shared.models';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-timetable-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timetable-feed.component.html',
  styleUrl: './timetable-feed.component.css'
})
export class TimetableFeedComponent implements OnInit {
  private timetableService = inject(TimetableService);
  private notificationService = inject(NotificationService);

  events: TimetableEvent[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.timetableService.getTimetableForUser().subscribe({
      next: (list) => {
        this.events = (list || []).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load timetable events');
        this.isLoading = false;
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotificationService, ToastNotification } from '../../Service/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications-toast',
  imports: [CommonModule],
  templateUrl: './notifications-toast.component.html',
  styleUrl: './notifications-toast.component.css'
})
export class NotificationsToastComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private subscription?: Subscription;
  
  notifications: ToastNotification[] = [];

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getIcon(type: ToastNotification['type']): string {
    const icons: Record<ToastNotification['type'], string> = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️'
    };
    return icons[type];
  }

  removeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }

  trackByFn(index: number, item: ToastNotification): string {
    return item.id;
  }
}
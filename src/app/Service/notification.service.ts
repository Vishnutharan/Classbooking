import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  private notificationId = 0;

  showSuccess(message: string): void {
    this.addNotification('success', message);
  }

  showError(message: string): void {
    this.addNotification('error', message);
  }

  showInfo(message: string): void {
    this.addNotification('info', message);
  }

  showWarning(message: string): void {
    this.addNotification('warning', message);
  }

  private addNotification(type: Notification['type'], message: string): void {
    const notification: Notification = {
      id: `notification-${++this.notificationId}`,
      type,
      message,
      timestamp: new Date()
    };

    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      const updated = this.notificationsSubject.value.filter(n => n.id !== notification.id);
      this.notificationsSubject.next(updated);
    }, 5000);
  }

  removeNotification(id: string): void {
    const updated = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(updated);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
  }
}
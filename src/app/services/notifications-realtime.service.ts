import { Injectable, inject } from '@angular/core';
import { Subject, Observable, timer, retry, share } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { NotificationService } from './notification.service';

export interface RealtimeNotification {
  type: 'BOOKING_UPDATE' | 'NEW_MESSAGE' | 'SYSTEM_ALERT' | 'CLASS_REMINDER';
  payload: any;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsRealtimeService {
  private notificationService = inject(NotificationService);
  private socket$: WebSocketSubject<any> | undefined;
  private messagesSubject$ = new Subject<RealtimeNotification>();
  public messages$ = this.messagesSubject$.asObservable();
  
  private readonly RECONNECT_INTERVAL = 5000;
  private readonly WS_ENDPOINT = 'ws://localhost:8080/notifications'; // Mock endpoint

  constructor() {
    // In a real app, connect only when user is logged in
    // this.connect();
  }

  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket({
        url: this.WS_ENDPOINT,
        openObserver: {
          next: () => console.log('WebSocket connection established')
        },
        closeObserver: {
          next: () => {
            console.log('WebSocket connection closed. Retrying...');
            this.scheduleReconnect();
          }
        }
      });

      this.socket$.pipe(
        retry({ delay: this.RECONNECT_INTERVAL })
      ).subscribe({
        next: (msg) => this.handleMessage(msg),
        error: (err) => console.error('WebSocket error:', err)
      });
    }
  }

  private handleMessage(message: any): void {
    const notification: RealtimeNotification = {
      type: message.type,
      payload: message.data,
      timestamp: Date.now()
    };

    this.messagesSubject$.next(notification);
    this.playSoundNotification();

    // Integrate with existing NotificationService for UI toasts
    switch (message.type) {
      case 'BOOKING_UPDATE':
        this.notificationService.showInfo(`Booking Update: ${message.data.status}`);
        break;
      case 'NEW_MESSAGE':
        this.notificationService.showInfo(`New Message from ${message.data.sender}`);
        break;
      case 'CLASS_REMINDER':
        this.notificationService.showWarning(`Reminder: ${message.data.message}`);
        break;
    }
  }

  public sendMessage(type: string, data: any): void {
    if (this.socket$) {
      this.socket$.next({ type, data });
    }
  }

  private playSoundNotification(): void {
    try {
      const audio = new Audio('assets/sounds/notification.mp3');
      audio.play().catch(e => console.warn('Audio play failed', e));
    } catch (error) {
      console.warn('Audio notification error', error);
    }
  }

  private scheduleReconnect(): void {
    timer(this.RECONNECT_INTERVAL).subscribe(() => this.connect());
  }

  public disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = undefined;
    }
  }
}
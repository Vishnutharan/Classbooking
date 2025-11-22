/**
 * Notification-related models
 * Extracted from notification.service.ts and notifications-realtime.service.ts
 */

export interface ToastNotification {
    id?: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

export interface RealtimeNotification {
    id: string;
    userId: string;
    type: 'booking' | 'message' | 'reminder' | 'system';
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
    actionUrl?: string;
}

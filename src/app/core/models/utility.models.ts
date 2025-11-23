/**
 * Utility models for internal services
 * Extracted from various utility services
 */

// From CacheService.ts and cache.service.ts
export interface CacheEntry {
    data: any;
    timestamp: number;
    ttl: number;
}

// From progress-tracking.service.ts
export interface ProgressMetrics {
    studentId: string;
    totalClasses: number;
    completedClasses: number;
    averageGrade: number;
    attendanceRate: number;
}

// From store.service.ts
export interface AppState {
    user: any;
    bookings: any[];
    notifications: any[];
    settings: any;
}

// From video-call.service.ts
export interface VideoCallState {
    callId: string;
    isActive: boolean;
    participants: string[];
    startTime: Date;
}

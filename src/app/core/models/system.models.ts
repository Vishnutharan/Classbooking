/**
 * System settings and configuration models
 * Extracted from shared.models.ts
 */

export interface SystemSettings {
    id: string;
    platformName: string;
    platformEmail: string;
    defaultHourlyRate: number;
    maxClassDurationMinutes: number;
    minClassDurationMinutes: number;
    cancellationDeadlineHours: number;
    platformCommissionPercentage: number;
}

export interface PublicHoliday {
    id: string;
    name: string;
    date: Date;
    description?: string;
}

export interface ExamSeason {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    examType: 'OLevel' | 'ALevel' | 'Scholarship';
}

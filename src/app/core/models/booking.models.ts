/**
 * Booking-related models
 * Extracted from class-booking.service.ts and shared.models.ts
 */

export interface ClassBooking {
    id: string;
    studentId: string;
    teacherId: string;
    subject: string;
    date: Date;
    startTime: string;
    endTime: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
    classType: 'OneTime' | 'Recurring';
    recurringDays?: string[];
    notes?: string;
    meetingLink?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BookingRequest {
    teacherId: string;
    subject: string;
    date: Date;
    startTime: string;
    endTime: string;
    classType: 'OneTime' | 'Recurring';
    recurringDays?: string[];
    notes?: string;
}

export interface BookingResponse {
    success: boolean;
    message: string;
    booking?: ClassBooking;
}

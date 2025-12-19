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
    paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
    classType: 'Personal_1_1' | 'Group' | 'OneTime' | 'Recurring'; // Extending existing types
    mode: 'ONLINE' | 'IN_PERSON';
    locationOrLink: string;
    price: number;
    durationMinutes: number;
    bookingGradeLevel: string;
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
    classType: 'Personal_1_1' | 'Group' | 'OneTime' | 'Recurring';
    mode: 'ONLINE' | 'IN_PERSON';
    bookingGradeLevel: string;
    notes?: string;
}

export interface BookingResponse {
    success: boolean;
    message: string;
    booking?: ClassBooking;
}

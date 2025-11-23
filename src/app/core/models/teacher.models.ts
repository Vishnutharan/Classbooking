/**
 * Teacher-related models
 * Extracted from teacher.service.ts and shared.models.ts
 */

export interface TeacherSubject {
    id: string;
    name: string;
    medium: 'Sinhala' | 'Tamil' | 'English';
    level: 'Primary' | 'OLevel' | 'ALevel' | 'Secondary' | 'Advanced';
}

export interface TeacherAvailability {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

export interface TeacherProfile {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    profilePicture?: string;
    bio?: string;
    qualifications: string[];
    subjects: TeacherSubject[];
    hourlyRate: number;
    experienceYears: number;
    averageRating: number;
    totalReviews: number;
    totalClasses: number;
    isAvailable: boolean;
    availability: TeacherAvailability[];
    verificationStatus: 'Pending' | 'Verified' | 'Rejected';
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateTeacherRequest {
    fullName?: string;
    phoneNumber?: string;
    bio?: string;
    qualifications?: string[];
    subjects?: TeacherSubject[];
    hourlyRate?: number;
    experienceYears?: number;
    availability?: TeacherAvailability[];
    isAvailable?: boolean;
}

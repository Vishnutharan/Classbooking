/**
 * Student-related models
 * Extracted from student.service.ts and shared.models.ts
 */

export interface StudentProfile {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    profilePicture?: string;
    gradeLevel: 'Primary' | 'OLevel' | 'ALevel';
    school?: string;
    focusAreas: string[];
    targetExams: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateStudentProfileRequest {
    fullName?: string;
    phoneNumber?: string;
    gradeLevel?: 'Primary' | 'OLevel' | 'ALevel';
    school?: string;
    focusAreas?: string[];
    targetExams?: string[];
}

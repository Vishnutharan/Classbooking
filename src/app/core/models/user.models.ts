/**
 * User-related models
 * Extracted from shared.models.ts
 */

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'Student' | 'Teacher' | 'Admin';
    password?: string;
    profilePicture?: string;
    bio?: string;
    subjects?: string[];
    phoneNumber?: string;
    status?: 'Active' | 'Inactive' | 'Suspended';
    createdAt?: Date;
    lastLogin?: Date;
}

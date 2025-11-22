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

export interface Resource {
    id: string;
    title: string;
    type: 'Video' | 'PDF' | 'Quiz' | 'Notes' | 'PastPaper';
    url: string;
    description?: string;
    uploadedAt?: Date;
    uploadedBy?: string;
}

export interface ExamPreparation {
    id: string;
    examType: 'OLevel' | 'ALevel' | 'Scholarship';
    subject: string;
    description: string;
    resources: Resource[];
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

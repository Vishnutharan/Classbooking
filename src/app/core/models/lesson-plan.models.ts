/**
 * Lesson Planning Models
 * Models for creating and managing lesson plans
 */

export interface LessonPlan {
    id: string;
    teacherId: string;
    subject: string;
    grade: string;
    title: string;
    description: string;
    curriculumTopic: CurriculumTopic;
    learningObjectives: LearningObjective[];
    resources: LessonResource[];
    activities: LessonActivity[];
    assessment: AssessmentMethod[];
    duration: number; // in minutes
    scheduledDate?: Date;
    status: 'Draft' | 'Planned' | 'In Progress' | 'Completed';
    tags: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CurriculumTopic {
    id: string;
    subject: string;
    grade: string;
    unit: string;
    topic: string;
    subtopics: string[];
    syllabusSectionReference?: string; // Reference to Sri Lankan syllabus section
}

export interface LearningObjective {
    id: string;
    description: string;
    category: 'Knowledge' | 'Comprehension' | 'Application' | 'Analysis' | 'Synthesis' | 'Evaluation';
    achieved?: boolean;
}

export interface LessonResource {
    id: string;
    type: 'PDF' | 'Video' | 'Link' | 'Document' | 'Image' | 'Interactive';
    title: string;
    url?: string;
    file?: File;
    description?: string;
    uploadedAt: Date;
}

export interface LessonActivity {
    id: string;
    title: string;
    description: string;
    activityType: 'Discussion' | 'Practice' | 'Group Work' | 'Individual Work' | 'Demonstration';
    duration: number; // in minutes
    materials?: string[];
    instructions?: string;
}

export interface AssessmentMethod {
    id: string;
    type: 'Quiz' | 'Written Test' | 'Oral Test' | 'Practical' | 'Assignment' | 'Observation';
    description: string;
    criteria: string[];
    totalMarks?: number;
}

// Sri Lankan Education System specific curriculum data
export interface SriLankanCurriculumData {
    grade: string;
    subjects: SriLankanSubject[];
}

export interface SriLankanSubject {
    name: string;
    medium: 'Sinhala' | 'Tamil' | 'English';
    level: 'Primary' | 'Secondary' | 'OLevel' | 'ALevel';
    units: CurriculumUnit[];
}

export interface CurriculumUnit {
    unitNumber: number;
    unitName: string;
    topics: string[];
    suggestedLessons: number;
}

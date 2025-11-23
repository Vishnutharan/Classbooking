/**
 * Resource and exam preparation models
 * Extracted from shared.models.ts
 */

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

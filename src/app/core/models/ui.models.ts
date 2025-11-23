/**
 * UI component models
 * Extracted from various component files
 */

// From filters.component.ts
export interface FilterOption {
    key: string;
    label: string;
    type: 'checkbox' | 'dropdown' | 'multiselect';
    options?: { label: string; value: any }[];
    value?: any;
}

export interface FilterConfig {
    filters: FilterOption[];
}

// From sidebar.component.ts
export interface MenuItem {
    icon: string;
    label: string;
    route: string;
    roles: string[];
}

// From reviews-ratings.component.ts
export interface Review {
    id: string;
    studentName: string;
    studentPicture?: string;
    rating: number;
    text: string;
    date: Date;
    helpful: number;
    reply?: string;
}

// From admin-reports-viewer.component.ts
export interface ReportHistory {
    id: string;
    type: string;
    format: string;
    generatedAt: Date;
    downloadUrl: string;
}

// From resources-upload.component.ts
export interface UploadedResource {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: Date;
    url: string;
}

import { Injectable } from '@angular/core';
import { SubjectCombination } from '../models/shared.models';

export interface GradeLevel {
    grade: number;
    level: 'Primary' | 'OLevel' | 'ALevel';
    description: string;
}

export interface OLevelSubject {
    name: string;
    category: 'Mandatory' | 'Basket1' | 'Basket2' | 'Basket3';
    hasPractical?: boolean;
}

export interface ALevelStream {
    id: string;
    name: string;
    description: string;
    icon?: string;
}

export interface ExamTimeline {
    examType: 'OLevel' | 'ALevel' | 'Scholarship';
    year: number;
    registrationStart: Date;
    registrationEnd: Date;
    examStart: Date;
    examEnd: Date;
    resultsDate?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class SriLankanEducationService {

    constructor() { }

    /**
     * Returns all grade levels in Sri Lankan education system (1-13)
     */
    getGradeLevels(): GradeLevel[] {
        const grades: GradeLevel[] = [];

        // Primary: Grades 1-5
        for (let i = 1; i <= 5; i++) {
            grades.push({
                grade: i,
                level: 'Primary',
                description: `Grade ${i} - Primary Education`
            });
        }

        // O/Level: Grades 6-11
        for (let i = 6; i <= 11; i++) {
            grades.push({
                grade: i,
                level: 'OLevel',
                description: `Grade ${i} - ${i >= 10 ? 'O/Level Year' : 'Junior Secondary'}`
            });
        }

        // A/Level: Grades 12-13
        for (let i = 12; i <= 13; i++) {
            grades.push({
                grade: i,
                level: 'ALevel',
                description: `Grade ${i} - A/Level Year ${i - 11}`
            });
        }

        return grades;
    }

    /**
     * Returns O/Level subjects organized by categories
     */
    getOLevelSubjects(): OLevelSubject[] {
        return [
            // Mandatory Subjects
            { name: 'Sinhala Language', category: 'Mandatory' },
            { name: 'Tamil Language', category: 'Mandatory' },
            { name: 'Buddhism', category: 'Mandatory' },
            { name: 'Hinduism', category: 'Mandatory' },
            { name: 'Islam', category: 'Mandatory' },
            { name: 'Christianity', category: 'Mandatory' },
            { name: 'English Language', category: 'Mandatory' },
            { name: 'Mathematics', category: 'Mandatory' },
            { name: 'Science', category: 'Mandatory', hasPractical: true },
            { name: 'History', category: 'Mandatory' },

            // Basket 1 Subjects
            { name: 'Business & Accounting Studies', category: 'Basket1' },
            { name: 'Geography', category: 'Basket1' },
            { name: 'Civic Education', category: 'Basket1' },
            { name: 'Entrepreneurship Studies', category: 'Basket1' },
            { name: 'Second Language (Tamil)', category: 'Basket1' },
            { name: 'Second Language (Sinhala)', category: 'Basket1' },
            { name: 'Pali', category: 'Basket1' },
            { name: 'Sanskrit', category: 'Basket1' },
            { name: 'Arabic', category: 'Basket1' },
            { name: 'French', category: 'Basket1' },
            { name: 'German', category: 'Basket1' },
            { name: 'Hindi', category: 'Basket1' },
            { name: 'Japanese', category: 'Basket1' },
            { name: 'Korean', category: 'Basket1' },
            { name: 'Chinese', category: 'Basket1' },

            // Basket 2 Subjects
            { name: 'Eastern Music', category: 'Basket2', hasPractical: true },
            { name: 'Western Music', category: 'Basket2', hasPractical: true },
            { name: 'Carnatic Music', category: 'Basket2', hasPractical: true },
            { name: 'Eastern Dancing', category: 'Basket2', hasPractical: true },
            { name: 'Bharatha Dancing', category: 'Basket2', hasPractical: true },
            { name: 'Art', category: 'Basket2', hasPractical: true },
            { name: 'Drama and Theatre', category: 'Basket2', hasPractical: true },
            { name: 'English Literature', category: 'Basket2' },
            { name: 'Sinhala Literature', category: 'Basket2' },
            { name: 'Tamil Literature', category: 'Basket2' },

            // Basket 3 Subjects
            { name: 'Information & Communication Technology', category: 'Basket3' },
            { name: 'Agriculture & Food Technology', category: 'Basket3', hasPractical: true },
            { name: 'Aquatic Bio Resources Technology', category: 'Basket3', hasPractical: true },
            { name: 'Arts & Crafts', category: 'Basket3', hasPractical: true },
            { name: 'Home Economics', category: 'Basket3', hasPractical: true },
            { name: 'Health & Physical Education', category: 'Basket3', hasPractical: true },
            { name: 'Communication & Media Studies', category: 'Basket3' },
            { name: 'Design & Construction Technology', category: 'Basket3', hasPractical: true },
            { name: 'Design & Mechanical Technology', category: 'Basket3', hasPractical: true },
            { name: 'Electrical & Electronic Technology', category: 'Basket3', hasPractical: true }
        ];
    }

    /**
     * Returns available A/Level streams
     */
    getALevelStreams(): ALevelStream[] {
        return [
            {
                id: 'science',
                name: 'Science',
                description: 'For students interested in medicine, engineering, IT, and technical fields',
                icon: '🔬'
            },
            {
                id: 'commerce',
                name: 'Commerce',
                description: 'For careers in business, accounting, finance, and management',
                icon: '💼'
            },
            {
                id: 'arts',
                name: 'Arts & Humanities',
                description: 'For teaching, journalism, law, public service, and creative arts',
                icon: '📚'
            },
            {
                id: 'technology',
                name: 'Technology',
                description: 'For new Bachelor of Technology degree programs',
                icon: '⚙️'
            }
        ];
    }

    /**
     * Returns valid subject combinations for a given A/Level stream
     */
    getValidSubjectCombinations(stream: 'Science' | 'Commerce' | 'Arts' | 'Technology'): SubjectCombination[] {
        const combinations: SubjectCombination[] = [];

        switch (stream) {
            case 'Science':
                combinations.push(
                    {
                        id: 'sci-bio',
                        stream: 'Science',
                        name: 'Biological Science',
                        subjects: ['Biology', 'Chemistry', 'Physics'],
                        description: 'For medicine, dental, veterinary, and health sciences'
                    },
                    {
                        id: 'sci-phy',
                        stream: 'Science',
                        name: 'Physical Science',
                        subjects: ['Physics', 'Chemistry', 'Combined Mathematics'],
                        description: 'For engineering and physical sciences'
                    },
                    {
                        id: 'sci-agri',
                        stream: 'Science',
                        name: 'Agriculture Science',
                        subjects: ['Biology', 'Chemistry', 'Agriculture Science'],
                        description: 'For agriculture or environmental careers'
                    },
                    {
                        id: 'sci-ict',
                        stream: 'Science',
                        name: 'ICT Science',
                        subjects: ['Physics', 'Combined Mathematics', 'ICT'],
                        description: 'For IT and computer science fields'
                    }
                );
                break;

            case 'Commerce':
                combinations.push(
                    {
                        id: 'com-acc-bus-eco',
                        stream: 'Commerce',
                        name: 'Business Management',
                        subjects: ['Accounting', 'Business Studies', 'Economics'],
                        description: 'Traditional commerce stream for business careers'
                    },
                    {
                        id: 'com-acc-bus-ict',
                        stream: 'Commerce',
                        name: 'Business Technology',
                        subjects: ['Accounting', 'Business Studies', 'ICT'],
                        description: 'Modern business with technology focus'
                    },
                    {
                        id: 'com-bus-eco-logic',
                        stream: 'Commerce',
                        name: 'Business Economics',
                        subjects: ['Business Studies', 'Economics', 'Logic & Scientific Method'],
                        description: 'Economics and analytical thinking'
                    }
                );
                break;

            case 'Arts':
                combinations.push(
                    {
                        id: 'arts-lang-hist-geo',
                        stream: 'Arts',
                        name: 'Social Sciences',
                        subjects: ['History', 'Geography', 'Economics'],
                        description: 'For social science and humanities studies'
                    },
                    {
                        id: 'arts-lang-econ-logic',
                        stream: 'Arts',
                        name: 'Economics & Logic',
                        subjects: ['Economics', 'Logic & Scientific Method', 'Political Science'],
                        description: 'For law and analytical fields'
                    },
                    {
                        id: 'arts-languages',
                        stream: 'Arts',
                        name: 'Languages',
                        subjects: ['English', 'Sinhala', 'Tamil'],
                        description: 'For teaching and translation'
                    },
                    {
                        id: 'arts-media',
                        stream: 'Arts',
                        name: 'Media & Communication',
                        subjects: ['Mass Media', 'English', 'Sinhala Literature'],
                        description: 'For journalism and media careers'
                    }
                );
                break;

            case 'Technology':
                combinations.push(
                    {
                        id: 'tech-eng',
                        stream: 'Technology',
                        name: 'Engineering Technology',
                        subjects: ['Science for Technology', 'Engineering Technology', 'ICT'],
                        description: 'For engineering technology programs'
                    },
                    {
                        id: 'tech-bio',
                        stream: 'Technology',
                        name: 'Bio-system Technology',
                        subjects: ['Science for Technology', 'Bio-system Technology', 'ICT'],
                        description: 'For agricultural and bio-technology programs'
                    }
                );
                break;
        }

        return combinations;
    }

    /**
     * Returns all subjects for a given stream
     */
    getStreamSubjects(stream: 'Science' | 'Commerce' | 'Arts' | 'Technology'): string[] {
        const subjects: Set<string> = new Set();

        const combinations = this.getValidSubjectCombinations(stream);
        combinations.forEach(combo => {
            combo.subjects.forEach(subject => subjects.add(subject));
        });

        // Add additional common subjects
        switch (stream) {
            case 'Science':
                subjects.add('Higher Mathematics');
                break;
            case 'Commerce':
                break;
            case 'Arts':
                subjects.add('Buddhist Civilization');
                subjects.add('Hindu Civilization');
                subjects.add('Islamic Civilization');
                subjects.add('Christian Civilization');
                subjects.add('Greek and Roman Civilization');
                break;
        }

        return Array.from(subjects).sort();
    }

    /**
     * Returns exam timelines for current and next year
     */
    getExamTimelines(): ExamTimeline[] {
        const currentYear = new Date().getFullYear();

        return [
            {
                examType: 'OLevel',
                year: currentYear,
                registrationStart: new Date(currentYear, 4, 1), // May
                registrationEnd: new Date(currentYear, 5, 30), // June
                examStart: new Date(currentYear, 11, 1), // December
                examEnd: new Date(currentYear, 11, 20),
                resultsDate: new Date(currentYear + 1, 3, 15) // April next year
            },
            {
                examType: 'ALevel',
                year: currentYear,
                registrationStart: new Date(currentYear, 3, 1), // April
                registrationEnd: new Date(currentYear, 4, 31), // May
                examStart: new Date(currentYear, 7, 1), // August
                examEnd: new Date(currentYear, 8, 30), // September
                resultsDate: new Date(currentYear, 11, 31) // December
            },
            {
                examType: 'Scholarship',
                year: currentYear,
                registrationStart: new Date(currentYear, 2, 1), // March
                registrationEnd: new Date(currentYear, 3, 30), // April
                examStart: new Date(currentYear, 7, 15), // August
                examEnd: new Date(currentYear, 7, 15),
                resultsDate: new Date(currentYear, 10, 30) // November
            }
        ];
    }

    /**
     * Get subjects based on grade level
     */
    getSubjectsByGradeLevel(gradeLevel: 'Primary' | 'OLevel' | 'ALevel', stream?: string): string[] {
        if (gradeLevel === 'Primary') {
            return [
                'Mathematics',
                'English',
                'Sinhala',
                'Tamil',
                'Science',
                'Social Studies',
                'Buddhism',
                'Hinduism',
                'Islam',
                'Christianity'
            ];
        } else if (gradeLevel === 'OLevel') {
            return this.getOLevelSubjects().map(s => s.name);
        } else if (gradeLevel === 'ALevel' && stream) {
            return this.getStreamSubjects(stream as any);
        }

        return [];
    }
}

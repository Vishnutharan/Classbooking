import { TeacherProfile, TeacherAvailability } from '../Service/teacher.service';
import { StudentProfile, ExamPreparation, Resource } from '../Service/student.service';
import { ClassBooking } from '../Service/class-booking.service';
import { User } from '../Service/auth.service';

export const MOCK_AVAILABILITY: TeacherAvailability[] = [
  { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '18:00' },
  { dayOfWeek: 'Friday', startTime: '09:00', endTime: '16:00' }
];

export const MOCK_TEACHERS: TeacherProfile[] = [
  {
    id: 't1',
    userId: 'u1',
    fullName: 'Mr. Aravinda Silva',
    email: 'aravinda@example.com',
    phoneNumber: '+94771234567',
    profilePicture: 'https://via.placeholder.com/150',
    bio: 'Experienced Mathematics teacher with 10 years of experience in O-Levels.',
    qualifications: ['BSc Mathematics', 'PGDE'],
    subjects: [{ id: 's1', name: 'Mathematics', medium: 'Sinhala', level: 'OLevel' }],
    hourlyRate: 1500,
    experienceYears: 10,
    averageRating: 4.8,
    totalReviews: 120,
    totalClasses: 500,
    isAvailable: true,
    availability: MOCK_AVAILABILITY,
    verificationStatus: 'Verified',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date()
  },
  {
    id: 't2',
    userId: 'u2',
    fullName: 'Ms. Kamala Perera',
    email: 'kamala@example.com',
    phoneNumber: '+94719876543',
    profilePicture: 'https://via.placeholder.com/150',
    bio: 'Science teacher specializing in Biology and Chemistry.',
    qualifications: ['BSc Science', 'MSc Biology'],
    subjects: [{ id: 's2', name: 'Science', medium: 'English', level: 'OLevel' }],
    hourlyRate: 1200,
    experienceYears: 8,
    averageRating: 4.9,
    totalReviews: 95,
    totalClasses: 300,
    isAvailable: true,
    availability: MOCK_AVAILABILITY,
    verificationStatus: 'Verified',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date()
  }
];

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    id: 'st1',
    userId: 'u3',
    fullName: 'Nimali Fernando',
    email: 'nimali@example.com',
    phoneNumber: '+94701112233',
    gradeLevel: 'OLevel',
    school: 'Visakha Vidyalaya',
    focusAreas: ['Mathematics', 'Science'],
    targetExams: ['2025 O/L'],
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date()
  },
  {
    id: 'st2',
    userId: 'u4',
    fullName: 'Ruwan Jayasinghe',
    email: 'ruwan@example.com',
    phoneNumber: '+94765556677',
    gradeLevel: 'ALevel',
    school: 'Royal College',
    focusAreas: ['Physics', 'Chemistry'],
    targetExams: ['2024 A/L'],
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date()
  }
];

export const MOCK_BOOKINGS: ClassBooking[] = [
  {
    id: 'b1',
    studentId: 'st1',
    teacherId: 't1',
    subject: 'Mathematics',
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    startTime: '10:00',
    endTime: '12:00',
    status: 'Confirmed',
    classType: 'OneTime',
    notes: 'Please cover Algebra basics',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'b2',
    studentId: 'st2',
    teacherId: 't2',
    subject: 'Science',
    date: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
    startTime: '14:00',
    endTime: '16:00',
    status: 'Completed',
    classType: 'OneTime',
    notes: 'Genetics chapter',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', email: 'aravinda@example.com', fullName: 'Mr. Aravinda Silva', role: 'Teacher' },
  { id: 'u2', email: 'kamala@example.com', fullName: 'Ms. Kamala Perera', role: 'Teacher' },
  { id: 'u3', email: 'nimali@example.com', fullName: 'Nimali Fernando', role: 'Student' },
  { id: 'u4', email: 'ruwan@example.com', fullName: 'Ruwan Jayasinghe', role: 'Student' },
  { id: 'u5', email: 'admin@classbooking.com', fullName: 'System Admin', role: 'Admin' }
];

export const MOCK_RESOURCES: Resource[] = [
  { id: 'r1', title: 'Algebra 101', type: 'PDF', url: 'assets/docs/algebra.pdf', description: 'Basic Algebra notes' },
  { id: 'r2', title: 'Physics Mechanics', type: 'Video', url: 'assets/videos/mechanics.mp4', description: 'Lecture on Newton laws' }
];
import { User } from '../services/auth.service';
import { ClassBooking } from '../services/class-booking.service';
import { TeacherProfile } from '../services/teacher.service';

export class TestHelpers {
  static createMockUser(id: string = 'test-user-1', role: 'Student' | 'Teacher' | 'Admin' = 'Student'): User {
    return {
      id,
      email: `user-${id}@test.com`,
      fullName: `Test User ${id}`,
      role,
      profilePicture: 'assets/default-avatar.png'
    };
  }

  static createMockTeacher(id: string = 'teacher-1'): TeacherProfile {
    return {
      id,
      userId: `user-${id}`,
      fullName: `Teacher ${id}`,
      email: `teacher-${id}@test.com`,
      phoneNumber: '1234567890',
      qualifications: ['Degree'],
      subjects: [],
      hourlyRate: 1000,
      experienceYears: 5,
      averageRating: 4.5,
      totalReviews: 10,
      totalClasses: 50,
      isAvailable: true,
      availability: [],
      verificationStatus: 'Verified',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static createMockBooking(id: string = 'booking-1', status: 'Pending' | 'Confirmed' | 'Completed' = 'Pending'): ClassBooking {
    return {
      id,
      studentId: 'student-1',
      teacherId: 'teacher-1',
      subject: 'Math',
      date: new Date(),
      startTime: '10:00',
      endTime: '11:00',
      status,
      classType: 'OneTime',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static generateRandomId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

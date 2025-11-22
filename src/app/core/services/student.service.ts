import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DemoDataService } from './demo-data.service';
import { StudentProfile, Resource, ExamPreparation } from '../models/shared.models';

export interface UpdateStudentProfileRequest {
  phoneNumber?: string;
  gradeLevel?: string;
  school?: string;
  focusAreas?: string[];
  targetExams?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private demoData = inject(DemoDataService);

  private studentSubject = new BehaviorSubject<StudentProfile | null>(null);
  student$ = this.studentSubject.asObservable();

  getMyProfile(): Observable<StudentProfile> {
    const student = this.demoData.getStudentById('student-1');
    if (student) {
      this.studentSubject.next(student);
      return of(student).pipe(delay(300));
    }
    return throwError(() => new Error('Student profile not found'));
  }

  getStudentProfile(id: string): Observable<StudentProfile> {
    const student = this.demoData.getStudentById(id);
    if (!student) return throwError(() => new Error('Student not found'));
    return of(student).pipe(delay(300));
  }

  updateProfile(update: UpdateStudentProfileRequest): Observable<StudentProfile> {
    const student = this.demoData.getStudentById('student-1');
    if (!student) return throwError(() => new Error('Student not found'));

    const updatedStudent = { ...student, ...update, updatedAt: new Date() } as StudentProfile;
    this.demoData.updateStudent(updatedStudent);
    this.studentSubject.next(updatedStudent);
    return of(updatedStudent).pipe(delay(500));
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    return of({ url: URL.createObjectURL(file) }).pipe(delay(500));
  }

  getExamPreparations(examType?: string): Observable<ExamPreparation[]> {
    const preps: ExamPreparation[] = [
      {
        id: 'ep-1', description: 'Comprehensive O/L Math revision materials',
        examType: 'OLevel', subject: 'Mathematics', resources: []
      }
    ];
    return of(preps).pipe(delay(500));
  }

  getExamPreparationById(id: string): Observable<ExamPreparation> {
    return of({
      id: 'ep-1', description: 'Comprehensive O/L Math revision materials',
      examType: 'OLevel', subject: 'Mathematics', resources: []
    } as ExamPreparation).pipe(delay(300));
  }

  getStudyMaterials(subject: string, level?: string): Observable<Resource[]> {
    return of([]).pipe(delay(300));
  }

  getPastPapers(subject: string, examType: string, year?: number): Observable<Resource[]> {
    return of([]).pipe(delay(300));
  }

  getProgressReport(): Observable<any> {
    return of({ completedClasses: 10, averageScore: 85 }).pipe(delay(300));
  }

  getRecommendedTeachers(): Observable<any[]> {
    return of([]).pipe(delay(300));
  }

  getSummaryStats(): Observable<any> {
    return of({ classesAttended: 12, upcomingClasses: 2 }).pipe(delay(300));
  }
}
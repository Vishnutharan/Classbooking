import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { DemoDataService } from './demo-data.service';
import { TeacherProfile, TeacherSubject, TeacherAvailability } from '../models/shared.models';

export interface UpdateTeacherRequest {
  bio?: string;
  hourlyRate?: number;
  qualifications?: string[];
  subjects?: TeacherSubject[];
  availability?: TeacherAvailability[];
  isAvailable?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private demoData = inject(DemoDataService);

  getAllTeachers(): Observable<TeacherProfile[]> {
    return of(this.demoData.getTeachers()).pipe(delay(500));
  }

  getTeachersBySubject(subject: string): Observable<TeacherProfile[]> {
    const teachers = this.demoData.getTeachers().filter(t =>
      t.subjects.some(s => s.name.toLowerCase().includes(subject.toLowerCase()))
    );
    return of(teachers).pipe(delay(500));
  }

  getTeachersByLevel(level: string): Observable<TeacherProfile[]> {
    const teachers = this.demoData.getTeachers().filter(t =>
      t.subjects.some(s => s.level === level)
    );
    return of(teachers).pipe(delay(500));
  }

  getTeacherById(id: string): Observable<TeacherProfile> {
    const teacher = this.demoData.getTeacherById(id);
    if (!teacher) {
      return throwError(() => new Error('Teacher not found'));
    }
    return of(teacher).pipe(delay(300));
  }

  getMyProfile(): Observable<TeacherProfile> {
    // For demo, return the first teacher or find by logged in user if we had auth state here
    // Assuming 'teacher-1' is the logged in teacher for demo purposes
    const teacher = this.demoData.getTeacherById('teacher-1');
    if (!teacher) return throwError(() => new Error('Teacher profile not found'));
    return of(teacher).pipe(delay(300));
  }

  updateProfile(update: UpdateTeacherRequest): Observable<TeacherProfile> {
    const teacher = this.demoData.getTeacherById('teacher-1');
    if (!teacher) return throwError(() => new Error('Teacher not found'));

    const updatedTeacher = { ...teacher, ...update, updatedAt: new Date() };
    this.demoData.updateTeacher(updatedTeacher);
    return of(updatedTeacher).pipe(delay(500));
  }

  addSubject(subject: TeacherSubject): Observable<TeacherProfile> {
    const teacher = this.demoData.getTeacherById('teacher-1');
    if (!teacher) return throwError(() => new Error('Teacher not found'));

    teacher.subjects.push(subject);
    this.demoData.updateTeacher(teacher);
    return of(teacher).pipe(delay(300));
  }

  removeSubject(subjectId: string): Observable<TeacherProfile> {
    const teacher = this.demoData.getTeacherById('teacher-1');
    if (!teacher) return throwError(() => new Error('Teacher not found'));

    teacher.subjects = teacher.subjects.filter(s => s.id !== subjectId);
    this.demoData.updateTeacher(teacher);
    return of(teacher).pipe(delay(300));
  }

  updateAvailability(availability: TeacherAvailability[]): Observable<TeacherProfile> {
    const teacher = this.demoData.getTeacherById('teacher-1');
    if (!teacher) return throwError(() => new Error('Teacher not found'));

    teacher.availability = availability;
    this.demoData.updateTeacher(teacher);
    return of(teacher).pipe(delay(300));
  }

  searchTeachers(filters: any): Observable<TeacherProfile[]> {
    let teachers = this.demoData.getTeachers();
    // Implement filter logic if needed
    return of(teachers).pipe(delay(500));
  }

  getTopRatedTeachers(limit: number = 10): Observable<TeacherProfile[]> {
    const teachers = this.demoData.getTeachers()
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);
    return of(teachers).pipe(delay(300));
  }

  rateTeacher(teacherId: string, rating: number, review: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  getTeacherReviews(teacherId: string): Observable<any[]> {
    return of([
      { id: 1, studentName: 'Student A', rating: 5, comment: 'Great teacher!', date: new Date() },
      { id: 2, studentName: 'Student B', rating: 4, comment: 'Good explanation.', date: new Date() }
    ]).pipe(delay(300));
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    return of({ url: URL.createObjectURL(file) }).pipe(delay(500));
  }
}
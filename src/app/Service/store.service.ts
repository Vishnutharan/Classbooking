import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './auth.service';
import { ClassBooking } from './class-booking.service';
import { TeacherProfile } from './teacher.service';
import { StudentProfile } from './student.service';

export interface AppState {
  currentUser: User | null;
  bookings: ClassBooking[];
  teachers: TeacherProfile[];
  students: StudentProfile[];
  notifications: any[];
  loading: boolean;
}

const INITIAL_STATE: AppState = {
  currentUser: null,
  bookings: [],
  teachers: [],
  students: [],
  notifications: [],
  loading: false
};

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private stateSubject = new BehaviorSubject<AppState>(INITIAL_STATE);
  public state$ = this.stateSubject.asObservable();

  // Selectors
  select<K extends keyof AppState>(key: K): Observable<AppState[K]> {
    return new Observable(observer => {
      const sub = this.state$.subscribe(state => {
        observer.next(state[key]);
      });
      return () => sub.unsubscribe();
    });
  }

  // Getters
  get state(): AppState {
    return this.stateSubject.getValue();
  }

  // Actions
  setCurrentUser(user: User | null): void {
    this.updateState({ currentUser: user });
  }

  setBookings(bookings: ClassBooking[]): void {
    this.updateState({ bookings });
  }

  addBooking(booking: ClassBooking): void {
    this.updateState({ bookings: [...this.state.bookings, booking] });
  }

  updateBooking(updatedBooking: ClassBooking): void {
    const bookings = this.state.bookings.map(b => 
      b.id === updatedBooking.id ? updatedBooking : b
    );
    this.updateState({ bookings });
  }

  setTeachers(teachers: TeacherProfile[]): void {
    this.updateState({ teachers });
  }

  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  resetState(): void {
    this.stateSubject.next(INITIAL_STATE);
  }

  private updateState(newState: Partial<AppState>): void {
    this.stateSubject.next({
      ...this.state,
      ...newState
    });
  }
}
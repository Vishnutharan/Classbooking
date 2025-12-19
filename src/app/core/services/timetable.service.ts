import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TimetableEvent } from '../models/shared.models';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  getTimetableForUser(from?: Date, to?: Date): Observable<TimetableEvent[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from.toISOString());
    if (to) params = params.set('to', to.toISOString());
    return this.http.get<TimetableEvent[]>(`${this.apiUrl}/timetable`, { params }).pipe(
      catchError(() => of([]))
    );
  }

  // Admin APIs
  getAllTimetable(from?: Date, to?: Date): Observable<TimetableEvent[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from.toISOString());
    if (to) params = params.set('to', to.toISOString());
    return this.http.get<TimetableEvent[]>(`${this.apiUrl}/admin/timetable`, { params }).pipe(
      catchError(() => of([]))
    );
  }

  createEvent(evt: Partial<TimetableEvent>): Observable<TimetableEvent> {
    return this.http.post<TimetableEvent>(`${this.apiUrl}/admin/timetable`, evt).pipe(
      catchError(() => of(evt as TimetableEvent))
    );
  }

  updateEvent(id: string, evt: Partial<TimetableEvent>): Observable<TimetableEvent> {
    return this.http.put<TimetableEvent>(`${this.apiUrl}/admin/timetable/${id}`, evt).pipe(
      catchError(() => of({ ...(evt as TimetableEvent), id }))
    );
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/timetable/${id}`).pipe(
      catchError(() => of(true))
    );
  }
}

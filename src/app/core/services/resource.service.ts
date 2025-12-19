import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Resource {
  id: string;
  teacherProfileId: string;
  title: string;
  description?: string;
  type: string;
  subject: string;
  level: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType?: string;
  isPublic: boolean;
  studentId?: string;
  uploadedAt: Date;
  downloadCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private apiUrl = `${environment.apiUrl}/resources`;

  constructor(private http: HttpClient) { }

  uploadResource(formData: FormData): Observable<Resource> {
    return this.http.post<Resource>(`${this.apiUrl}/upload`, formData);
  }

  getTeacherResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.apiUrl}/teacher`);
  }

  getStudentResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.apiUrl}/student`);
  }

  deleteResource(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

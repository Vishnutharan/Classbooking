import { HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { NotificationService } from '../Service/notification.service';

export function errorInterceptor(
  req: HttpRequest<any>,
  next: any
): Observable<HttpEvent<any>> {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 0) {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else if (error.status === 400) {
          errorMessage = error.error?.message || 'Invalid request. Please check your input.';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized. Please log in again.';
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (error.status === 404) {
          errorMessage = 'The requested resource was not found.';
        } else if (error.status === 409) {
          errorMessage = error.error?.message || 'Conflict: This resource already exists.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.status === 503) {
          errorMessage = 'Service unavailable. Please try again later.';
        } else {
          errorMessage = error.error?.message || `Error: ${error.statusText}`;
        }
      }

      notificationService.showError(errorMessage);
      console.error('HTTP Error:', error);

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        details: error.error
      }));
    })
  );
}
import { HttpEvent, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { timeout, retry, catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';

const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 1;

export function timeoutInterceptor(
  req: HttpRequest<any>,
  next: any
): Observable<HttpEvent<any>> {
  const notificationService = inject(NotificationService);

  // Skip timeout for file uploads and long-running operations
  const skipTimeout = req.url.includes('/upload') || req.url.includes('/import');

  if (skipTimeout) {
    return next(req);
  }

  return next(req).pipe(
    timeout(REQUEST_TIMEOUT),
    retry({
      count: MAX_RETRIES,
      delay: (error: any, retryCount: number) => {
        if (retryCount === 1) {
          console.warn(`Retrying request: ${req.method} ${req.url}`);
        }
        return timer(1000); // Wait 1 second before retry
      }
    }),
    catchError((error: any) => {
      let errorMessage = 'Request failed';

      if (error.name === 'TimeoutError') {
        errorMessage = 'Request timeout. Please check your connection and try again.';
        notificationService.showError(errorMessage);
      } else if (error instanceof HttpErrorResponse) {
        errorMessage = `Error: ${error.statusText || 'Unknown error'}`;
      }

      return throwError(() => error);
    })
  );
}

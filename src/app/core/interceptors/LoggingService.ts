import { HttpEvent, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

class LoggingService {
  private readonly isDevelopment = !environment.production;
  private readonly sensitiveFields = ['password', 'token', 'Authorization', 'authorization'];

  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: any = {};
    for (const key in data) {
      if (this.sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        sanitized[key] = '***REDACTED***';
      } else if (typeof data[key] === 'object') {
        sanitized[key] = this.sanitizeData(data[key]);
      } else {
        sanitized[key] = data[key];
      }
    }
    return sanitized;
  }

  logRequest(req: HttpRequest<any>): void {
    if (!this.isDevelopment) return;

    const startTime = performance.now();
    const message = `🟦 [REQUEST] ${req.method} ${req.url}`;

    console.group(message);
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Params:', this.sanitizeData(req.params));

    if (req.body) {
      console.log('Body:', this.sanitizeData(req.body));
    }

    if (req.headers) {
      const headers: any = {};
      req.headers.keys().forEach(key => {
        if (!this.sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
          headers[key] = req.headers.get(key);
        }
      });
      if (Object.keys(headers).length > 0) {
        console.log('Headers:', headers);
      }
    }

    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();

    // Store timing info for response logging
    (req as any).startTime = startTime;
  }

  logResponse(req: HttpRequest<any>, event: HttpResponse<any>): void {
    if (!this.isDevelopment) return;

    const endTime = performance.now();
    const startTime = (req as any).startTime || endTime;
    const duration = (endTime - startTime).toFixed(2);

    const message = `🟩 [RESPONSE] ${req.method} ${req.url} (${duration}ms)`;

    console.group(message);
    console.log('Status:', event.status, event.statusText);
    console.log('Response:', this.sanitizeData(event.body));
    console.log('Duration:', `${duration}ms`);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }

  logError(req: HttpRequest<any>, error: any): void {
    if (!this.isDevelopment) return;

    const message = `🟥 [ERROR] ${req.method} ${req.url}`;

    console.group(message);
    console.log('URL:', req.url);
    console.log('Method:', req.method);

    if (error instanceof HttpErrorResponse) {
      console.log('Status:', error.status, error.statusText);
      console.log('Error Body:', this.sanitizeData(error.error));
    } else if (error instanceof Error) {
      console.log('Error Message:', error.message);
      console.log('Stack:', error.stack);
    } else {
      console.log('Error:', error);
    }

    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }
}

export function loggingInterceptor(
  req: HttpRequest<any>,
  next: any
): Observable<HttpEvent<any>> {
  const logger = new LoggingService();

  logger.logRequest(req);

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        logger.logResponse(req, event);
      }
    }),
    catchError(error => {
      logger.logError(req, error);
      throw error;
    })
  );
}
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function authInterceptor(req: HttpRequest<any>, next: any): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);
  let isRefreshing = false;
  const refreshTokenSubject = new BehaviorSubject<any>(null);

  // Skip token for auth endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  const token = authService.getToken();
  if (token) {
    req = addToken(req, token);
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((response: any) => {
              isRefreshing = false;
              refreshTokenSubject.next(response.token);
              return next(addToken(req, response.token));
            }),
            catchError((err) => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => err);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(token => {
              return next(addToken(req, token));
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
}

function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

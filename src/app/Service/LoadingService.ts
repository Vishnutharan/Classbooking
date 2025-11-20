import { HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class LoadingService {
  private loadingCounterSubject = new BehaviorSubject<number>(0);
  public loading$ = this.loadingCounterSubject.asObservable();

  increment(): void {
    const current = this.loadingCounterSubject.value;
    this.loadingCounterSubject.next(current + 1);
  }

  decrement(): void {
    const current = this.loadingCounterSubject.value;
    if (current > 0) {
      this.loadingCounterSubject.next(current - 1);
    }
  }

  isLoading(): boolean {
    return this.loadingCounterSubject.value > 0;
  }

  reset(): void {
    this.loadingCounterSubject.next(0);
  }
}

export function loadingInterceptor(
  req: HttpRequest<any>,
  next: any
): Observable<HttpEvent<any>> {
  const loadingService = inject(LoadingService);

  // Skip loading indicator for certain endpoints
  const skipLoading = req.url.includes('/health') || req.url.includes('/ping');

  if (!skipLoading) {
    loadingService.increment();
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        loadingService.decrement();
      }
    })
  );
}
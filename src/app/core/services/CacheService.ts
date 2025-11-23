import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { inject } from '@angular/core';

export interface CacheEntry {
  response: HttpResponse<any>;
  timestamp: number;
}

export class CacheService {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private skipCachePatterns = [
    '/bookings',
    '/users/profile',
    '/students/profile',
    '/teachers/profile',
    '/admin/stats'
  ];

  get(key: string): HttpResponse<any> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.response;
  }

  set(key: string, response: HttpResponse<any>): void {
    this.cache.set(key, {
      response: response.clone(),
      timestamp: Date.now()
    });
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private generateKey(req: HttpRequest<any>): string {
    return `${req.method}@${req.url}@${JSON.stringify(req.params)}`;
  }

  isCacheable(req: HttpRequest<any>): boolean {
    if (req.method !== 'GET') return false;
    return !this.skipCachePatterns.some(pattern => req.url.includes(pattern));
  }
}

export function cacheInterceptor(
  req: HttpRequest<any>,
  next: any
): Observable<HttpEvent<any>> {
  const cacheService = inject(CacheService);

  if (!cacheService.isCacheable(req)) {
    return next(req);
  }

  const cacheKey = `${req.method}@${req.url}@${JSON.stringify(req.params)}`;
  const cached = cacheService.get(cacheKey);

  if (cached) {
    return of(cached);
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cacheService.set(cacheKey, event);
      }
    })
  );
}
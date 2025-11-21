import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

interface CacheEntry {
  response: HttpResponse<any>;
  timestamp: number;
  expiry: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cacheMap = new Map<string, CacheEntry>();
  private readonly DEFAULT_MAX_AGE = 300000; // 5 minutes

  constructor() {}

  get(req: HttpRequest<any>): HttpResponse<any> | null {
    const key = this.getKey(req);
    const entry = this.cacheMap.get(key);

    if (!entry) return null;

    const isExpired = Date.now() > entry.expiry;
    if (isExpired) {
      this.cacheMap.delete(key);
      return null;
    }

    return entry.response;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>, maxAge: number = this.DEFAULT_MAX_AGE): void {
    const key = this.getKey(req);
    const entry: CacheEntry = {
      response,
      timestamp: Date.now(),
      expiry: Date.now() + maxAge
    };
    this.cacheMap.set(key, entry);
  }

  invalidate(urlPattern: string): void {
    this.cacheMap.forEach((_, key) => {
      if (key.includes(urlPattern)) {
        this.cacheMap.delete(key);
      }
    });
  }

  clear(): void {
    this.cacheMap.clear();
  }

  private getKey(req: HttpRequest<any>): string {
    return `${req.urlWithParams}`;
  }
}
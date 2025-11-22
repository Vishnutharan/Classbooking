/**
 * Authentication-related models
 * Extracted from auth.service.ts
 */

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: User;
}

// Re-export User from user.models.ts to avoid circular dependency issues
import { User } from './user.models';

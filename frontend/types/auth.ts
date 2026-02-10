/**
 * Authentication related types
 */

export type UserRole = 'user' | 'photographer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthError {
  message: string;
  field?: string;
}

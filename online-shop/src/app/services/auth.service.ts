import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User, UserLoginRequest } from '../features/shared/types/users.types';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';

export interface AuthSession {
  user: User;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/auth';

  login(request: UserLoginRequest): Observable<AuthSession> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => this.setToken(response.token)),
      switchMap((response) =>
        this.http
          .get<User>(`${this.apiUrl}/me`)
          .pipe(map((user) => ({ user, token: response.token }))),
      ),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private decodeToken(token: string | null): any {
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      if (!payload) return null;

      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const paddingLength = (4 - (base64.length % 4)) % 4;
      const padded = base64.padEnd(base64.length + paddingLength, '=');

      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    const payload = this.decodeToken(token);

    if (!payload?.['exp']) {
      return true;
    }

    const expirationTime = payload['exp'] * 1000;
    return Date.now() >= expirationTime;
  }

  hasValidSession(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload) return false;

    return !this.isTokenExpired();
  }

  validateSession(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }
}

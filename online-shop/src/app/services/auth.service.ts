import { inject, signal, computed } from '@angular/core';
import { Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { User, USER_ROLES, UserLoginRequest, UserRole } from '../features/shared/types/users.types';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/auth';
  private readonly _currentUser = signal<User | null>(null);
  public readonly currentUser = this._currentUser.asReadonly();
  public readonly isLoggedIn = computed(() => this._currentUser() !== null);

  login(request: UserLoginRequest): Observable<User> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => this.setToken(response.token)),
      switchMap(() => this.http.get<User>(`${this.apiUrl}/me`)),
      tap((user) => this._currentUser.set(user)),
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this._currentUser.set(null);
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

  getRole(): UserRole | null {
    const token = this.getToken();
    const payload = this.decodeToken(token);

    if (!payload?.['role']) {
      return null;
    }

    const role = payload['role'].replace(/^ROLE_/, '') as UserRole;
    return USER_ROLES.includes(role) ? role : null;
  }

  hasRole(role: UserRole): boolean {
    return this.getRole() === role;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    const payload = this.decodeToken(token);

    if (!payload?.['exp']) {
      return false;
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

  validateSession(): Observable<boolean> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this._currentUser.set(user);
      }),
      map(() => true),
      catchError(() => {
        this.logout();
        return of(false);
      }),
    );
  }
}

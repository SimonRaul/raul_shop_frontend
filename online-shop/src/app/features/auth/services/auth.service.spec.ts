import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { User } from '../../user/types/users.types';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  const user: User = {
    id: '1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    username: 'jane.doe',
    role: 'CUSTOMER',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('stores, reads, checks, and removes the authentication token', () => {
    expect(service.getToken()).toBeNull();
    expect(service.hasToken()).toBe(false);

    localStorage.setItem('auth_token', 'token');

    expect(service.getToken()).toBe('token');
    expect(service.hasToken()).toBe(true);

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.hasToken()).toBe(false);
  });

  it('logs in, stores the token, and loads the current user', async () => {
    const request = { username: 'jane.doe', password: 'password' };
    const login = firstValueFrom(service.login(request));

    const loginRequest = httpTestingController.expectOne('http://localhost:8080/api/auth/login');
    expect(loginRequest.request.method).toBe('POST');
    expect(loginRequest.request.body).toEqual(request);
    loginRequest.flush({ token: 'login-token' });

    const currentUserRequest = httpTestingController.expectOne('http://localhost:8080/api/auth/me');
    expect(currentUserRequest.request.method).toBe('GET');
    currentUserRequest.flush(user);

    await expect(login).resolves.toEqual({ user, token: 'login-token' });
    expect(service.getToken()).toBe('login-token');
  });

  it('logs out and rethrows when login fails', async () => {
    localStorage.setItem('auth_token', 'previous-token');
    const error = { status: 401, message: 'Unauthorized' };
    const login = firstValueFrom(
      service.login({ username: 'jane.doe', password: 'wrong-password' }),
    );

    const loginRequest = httpTestingController.expectOne('http://localhost:8080/api/auth/login');
    loginRequest.flush(error, { status: 401, statusText: 'Unauthorized' });

    await expect(login).rejects.toMatchObject({ status: error.status });
    expect(service.getToken()).toBeNull();
  });

  it('logs out and rethrows when loading the current user fails', async () => {
    const login = firstValueFrom(service.login({ username: 'jane.doe', password: 'password' }));

    const loginRequest = httpTestingController.expectOne('http://localhost:8080/api/auth/login');
    loginRequest.flush({ token: 'login-token' });

    const currentUserRequest = httpTestingController.expectOne('http://localhost:8080/api/auth/me');
    currentUserRequest.flush(
      { status: 500, message: 'Server error' },
      { status: 500, statusText: 'Server Error' },
    );

    await expect(login).rejects.toMatchObject({ status: 500 });
    expect(service.getToken()).toBeNull();
  });

  it('validates the current session through the API', async () => {
    const session = firstValueFrom(service.validateSession());
    const request = httpTestingController.expectOne('http://localhost:8080/api/auth/me');

    expect(request.request.method).toBe('GET');
    request.flush(user);

    await expect(session).resolves.toEqual(user);
  });

  it('reports tokens without an expiration as expired', () => {
    localStorage.setItem('auth_token', createToken({ sub: user.id }));

    expect(service.isTokenExpired()).toBe(true);
    expect(service.hasValidSession()).toBe(false);
  });

  it('reports valid and expired JWT tokens correctly', () => {
    localStorage.setItem('auth_token', createToken({ exp: Math.floor(Date.now() / 1000) + 60 }));
    expect(service.isTokenExpired()).toBe(false);
    expect(service.hasValidSession()).toBe(true);

    localStorage.setItem('auth_token', createToken({ exp: Math.floor(Date.now() / 1000) - 60 }));
    expect(service.isTokenExpired()).toBe(true);
    expect(service.hasValidSession()).toBe(false);
  });

  it('treats missing and malformed tokens as invalid sessions', () => {
    expect(service.isTokenExpired()).toBe(true);
    expect(service.hasValidSession()).toBe(false);

    localStorage.setItem('auth_token', 'not-a-jwt');

    expect(service.isTokenExpired()).toBe(true);
    expect(service.hasValidSession()).toBe(false);
  });
});

function createToken(payload: Record<string, unknown>): string {
  return `header.${btoa(JSON.stringify(payload))}.signature`;
}

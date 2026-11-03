import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { signal } from '@angular/core';
import { selectAuthState } from '../../../state/auth.reducers';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../state/auth.actions';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authState = signal<{ user: { role: string } | null }>({ user: null });
  let errorMessage = signal<string | null>(null);
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    authState.set({ user: null });
    errorMessage.set(null);
    dispatch = vi.fn();
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch,
            selectSignal: (selector: unknown) =>
              selector === selectAuthState ? authState : errorMessage,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch login action on form submission', () => {
    const formData = { username: 'test', password: 'password' };
    component.onLogin(formData);
    expect(component.errorMessage()).toBeUndefined();
    expect(dispatch).toHaveBeenCalledWith(AuthActions.login({ request: formData }));
    expect(dispatch).toHaveBeenCalledWith({
      type: '[Auth] Login',
      request: formData,
    });
  });

  it('should compute errorMessage correctly when the store state has an error', () => {
    authState.set({ user: null, error: 'Invalid credentials' } as any);
    expect(component.errorMessage()).toBe('Invalid credentials');
    authState.set({ user: null, error: null } as any);
    expect(component.errorMessage()).toBeNull();
  });
});

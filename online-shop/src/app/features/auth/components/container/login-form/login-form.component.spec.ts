import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { signal } from '@angular/core';
import { selectError, selectUser } from '../../../state/auth.reducers';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../state/auth.actions';
import { ActivatedRoute, Router } from '@angular/router';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let user = signal<{ role: string } | null>(null);
  let errorMessage = signal<string | null>(null);
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    user.set(null);
    errorMessage.set(null);
    dispatch = vi.fn();
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch,
            selectSignal: (selector: unknown) => (selector === selectUser ? user : errorMessage),
          },
        },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
        { provide: Router, useValue: { navigateByUrl: vi.fn() } },
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
    expect(component.errorMessage()).toBeNull();
    expect(dispatch).toHaveBeenCalledWith(AuthActions.login({ request: formData }));
    expect(dispatch).toHaveBeenCalledWith({
      type: '[Auth] Login',
      request: formData,
    });
  });

  it('should compute errorMessage correctly when the store state has an error', () => {
    errorMessage.set('Invalid credentials');
    expect(component.errorMessage()).toBe('Invalid credentials');
    errorMessage.set(null);
    expect(component.errorMessage()).toBeNull();
  });
});

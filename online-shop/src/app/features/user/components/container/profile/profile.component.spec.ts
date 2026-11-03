import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthState } from '../../../../auth/state/auth.reducers';
import { User } from '../../../types/users.types';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  const authState = signal<{ user: User | null; isLoading: boolean }>({
    user: null,
    isLoading: false,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            selectSignal: (selector: unknown) =>
              selector === selectAuthState ? authState : signal(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('exposes the authenticated user and loading state', () => {
    const user: User = {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      username: 'jane',
      role: 'CUSTOMER',
    };
    authState.set({ user, isLoading: true });

    expect(component.currentUser()).toEqual(user);
    expect(component.isLoading()).toBe(true);
  });
});

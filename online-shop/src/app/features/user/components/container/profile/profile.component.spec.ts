import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsLoading, selectUser } from '../../../../auth/state/auth.reducers';
import { User } from '../../../types/users.types';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  const currentUser = signal<User | null>(null);
  const isLoading = signal(false);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            selectSignal: (selector: unknown) =>
              selector === selectUser ? currentUser : isLoading,
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
    currentUser.set(user);
    isLoading.set(true);

    expect(component.currentUser()).toEqual(user);
    expect(component.isLoading()).toBe(true);
  });
});

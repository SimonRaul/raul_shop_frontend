import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../../auth/state/auth.reducers';
import { User } from '../../../../user/types/users.types';
import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;
  const currentUser = signal<User | null>(null);
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    dispatch = vi.fn();
    currentUser.set(null);
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch,
            selectSignal: () => currentUser,
          },
        },
        provideRouter([]),
      ],
    })
      .overrideComponent(PageHeaderComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
  });

  it('derives login state and user from the auth store', () => {
    expect(component.isLoggedIn()).toBe(false);
    const user: User = {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      username: 'jane',
      role: 'CUSTOMER',
    };
    currentUser.set(user);

    expect(component.isLoggedIn()).toBe(true);
    expect(component.currentUser()).toEqual(user);
  });

  it('dispatches logout', () => {
    component.onLogout();

    expect(dispatch).toHaveBeenCalled();
  });
});

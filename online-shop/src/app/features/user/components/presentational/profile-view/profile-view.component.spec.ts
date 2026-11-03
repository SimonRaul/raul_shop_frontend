import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileViewComponent } from './profile-view.component';
import { User } from '../../../types/users.types';

describe('ProfileViewComponent', () => {
  let component: ProfileViewComponent;
  let fixture: ComponentFixture<ProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileViewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentUser', null);
    await fixture.whenStable();
  });

  it('renders the empty state when no user is available', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No user data available.');
  });

  it('renders user details and initials', () => {
    const user: User = {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      username: 'jane',
      role: 'CUSTOMER',
    };
    fixture.componentRef.setInput('currentUser', user);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Jane Doe');
    expect(fixture.nativeElement.textContent).toContain('jane@example.com');
    expect(fixture.nativeElement.textContent).toContain('jane');
    expect(fixture.nativeElement.querySelector('.avatar-initials')?.textContent.trim()).toBe('JD');
  });

  it('shows a loading spinner when requested', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeTruthy();
  });
});

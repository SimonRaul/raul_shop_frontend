import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PageHeaderViewComponent } from './page-header-view.component';
import { User } from '../../../types/users.types';

describe('PageHeaderViewComponent', () => {
  let component: PageHeaderViewComponent;
  let fixture: ComponentFixture<PageHeaderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderViewComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderViewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isLoggedIn', false);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows login navigation when logged out', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Products');
    expect(fixture.nativeElement.textContent).toContain('login');
  });

  it('shows authenticated navigation and emits logout', () => {
    const user: User = {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      username: 'jane',
      role: 'CUSTOMER',
    };
    const logout = vi.fn();
    component.logoutClicked.subscribe(logout);
    fixture.componentRef.setInput('isLoggedIn', true);
    fixture.componentRef.setInput('currentUser', user);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Products');
    expect(fixture.nativeElement.textContent).toContain('Jane');
    (fixture.nativeElement.querySelector('button[mat-icon-button]:last-of-type') as HTMLButtonElement).click();

    expect(logout).toHaveBeenCalled();
  });
});

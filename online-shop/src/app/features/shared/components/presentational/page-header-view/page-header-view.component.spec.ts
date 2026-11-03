import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PageHeaderViewComponent } from './page-header-view.component';
import { User } from '../../../../user/types/users.types';

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

    const loginButton = fixture.nativeElement.querySelector(
      'button[routerLink="/login"]',
    ) as HTMLButtonElement;
    const cartLink = fixture.nativeElement.querySelector(
      'a[routerLink="/shopping-cart"]',
    ) as HTMLAnchorElement;
    expect(loginButton).toBeTruthy();
    expect(cartLink).toBeTruthy();
    expect(cartLink.getAttribute('href')).toBe('/shopping-cart');
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

    const productsLink = fixture.nativeElement.querySelector(
      'a[routerLink="/products"]',
    ) as HTMLAnchorElement;
    const profileButton = fixture.nativeElement.querySelector(
      'button[routerLink="/profile"]',
    ) as HTMLButtonElement;
    const logoutButton = Array.from(
      fixture.nativeElement.querySelectorAll(
        'button[mat-icon-button]',
      ) as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('logout')) as HTMLButtonElement;
    expect(productsLink.getAttribute('href')).toBe('/products');
    expect(profileButton).toBeTruthy();
    expect(profileButton.textContent).toContain('Jane');
    expect(logoutButton).toBeTruthy();

    logoutButton.click();

    expect(logout).toHaveBeenCalledOnce();
  });
});

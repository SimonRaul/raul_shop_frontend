import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../services/auth.service';
import { PageHeaderViewComponent } from '../../presentational/page-header-view/page-header-view.component';

@Component({
  imports: [PageHeaderViewComponent],
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-page-header-view
    [isLoggedIn]="authService.isLoggedIn()"
    [currentUser]="authService.currentUser()"
    (logoutClicked)="onLogout()"
  ></app-page-header-view>`,
})
export class PageHeaderComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

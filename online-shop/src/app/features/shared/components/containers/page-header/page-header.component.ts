import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PageHeaderViewComponent } from '../../presentational/page-header-view/page-header-view.component';
import { Store } from '@ngrx/store';
import { selectAuthState } from '../../../../auth/state/auth.reducers';
import { AuthActions } from '../../../../auth/state/auth.actions';

@Component({
  imports: [PageHeaderViewComponent],
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-page-header-view
    [isLoggedIn]="isLoggedIn()"
    [currentUser]="currentUser()"
    (logoutClicked)="onLogout()"
  ></app-page-header-view>`,
})
export class PageHeaderComponent {
  private readonly store = inject(Store);
  private readonly authState = this.store.selectSignal(selectAuthState);
  currentUser = computed(() => this.authState().user);
  isLoggedIn = computed(() => this.currentUser() !== null);

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PageHeaderViewComponent } from '../../presentational/page-header-view/page-header-view.component';
import { Store } from '@ngrx/store';
import { selectAuth } from '../../../state/app.reducers';
import { AuthActions } from '../../../state/app.actions';

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
  private store = inject(Store);
  private authState = this.store.selectSignal(selectAuth);
  currentUser = computed(() => this.authState().user);
  isLoggedIn = computed(() => this.currentUser() !== null);

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}

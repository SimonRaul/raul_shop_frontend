import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfileViewComponent } from '../../presentational/profile-view/profile-view.component';
import { Store } from '@ngrx/store';
import { selectIsLoading, selectUser } from '../../../../auth/state/auth.reducers';

@Component({
  imports: [ProfileViewComponent],
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-profile-view
    [currentUser]="currentUser()"
    [isLoading]="isLoading()"
  ></app-profile-view>`,
})
export class ProfileComponent {
  private readonly store = inject(Store);
  readonly currentUser = this.store.selectSignal(selectUser);
  readonly isLoading = this.store.selectSignal(selectIsLoading);
}

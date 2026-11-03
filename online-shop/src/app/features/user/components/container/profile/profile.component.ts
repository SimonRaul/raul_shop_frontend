import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ProfileViewComponent } from '../../presentational/profile-view/profile-view.component';
import { Store } from '@ngrx/store';
import { selectAuthState } from '../../../../auth/state/auth.reducers';

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
  private readonly authState = this.store.selectSignal(selectAuthState);
  currentUser = computed(() => this.authState().user);
  isLoading = computed(() => this.authState().isLoading);
}

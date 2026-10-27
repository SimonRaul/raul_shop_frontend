import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ProfileViewComponent } from '../../presentational/profile-view/profile-view.component';
import { Store } from '@ngrx/store';
import { selectAuth } from '../../../state/app.reducers';

@Component({
  imports: [ProfileViewComponent],
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-profile-view [currentUser]="currentUser()"></app-profile-view>`,
})
export class ProfileComponent {
  private store = inject(Store);
  private authState = this.store.selectSignal(selectAuth);
  currentUser = computed(() => this.authState().user);
}

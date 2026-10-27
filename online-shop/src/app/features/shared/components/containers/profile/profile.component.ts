import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ProfileViewComponent } from '../../presentational/profile-view/profile-view.component';
import { User } from '../../../types/users.types';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  imports: [ProfileViewComponent],
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-profile-view [currentUser]="currentUser()"></app-profile-view>`,
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  currentUser = this.authService.currentUser;
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '../../../types/users.types';
import { UpperCasePipe } from '@angular/common';

@Component({
  imports: [UpperCasePipe],
  selector: 'app-profile-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './profile-view.component.scss',
  templateUrl: './profile-view.component.html',
})
export class ProfileViewComponent {
  currentUser = input.required<User | null>();
}

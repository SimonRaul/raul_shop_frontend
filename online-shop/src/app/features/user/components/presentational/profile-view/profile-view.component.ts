import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '../../../types/users.types';
import { UpperCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/input';

@Component({
  imports: [UpperCasePipe, MatCardModule, MatProgressSpinnerModule, MatError],
  selector: 'app-profile-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './profile-view.component.scss',
  templateUrl: './profile-view.component.html',
})
export class ProfileViewComponent {
  readonly currentUser = input.required<User | null>();
  readonly isLoading = input<boolean>(false);
}

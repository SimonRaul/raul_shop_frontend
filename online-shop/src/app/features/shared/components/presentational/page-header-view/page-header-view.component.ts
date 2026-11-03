import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { User } from '../../../../user/types/users.types';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  selector: 'app-page-header-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './page-header-view.component.scss',
  templateUrl: './page-header-view.component.html',
})
export class PageHeaderViewComponent {
  readonly isLoggedIn = input.required<boolean>();
  readonly currentUser = input<User | null>(null);
  readonly logoutClicked = output<void>();
}

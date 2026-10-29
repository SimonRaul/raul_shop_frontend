import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { User } from '../../../types/users.types';
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
  isLoggedIn = input.required<boolean>();
  currentUser = input<User | null>(null);
  logoutClicked = output<void>();
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { User } from '../../../types/users.types';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UpperCasePipe } from '@angular/common';

@Component({
  imports: [RouterLink, RouterLinkActive, UpperCasePipe],
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

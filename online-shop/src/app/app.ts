import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeaderComponent } from './features/shared/components/containers/page-header/page-header.component';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth.service';
import { AuthActions } from './features/shared/state/app.actions';
import { selectAuth } from './features/shared/state/app.reducers';

@Component({
  imports: [RouterOutlet, PageHeaderComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('online-shop');
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  private readonly authState = this.store.selectSignal(selectAuth);

  ngOnInit(): void {
    const auth = this.authState();

    if (auth.isInitialized || auth.isLoading) {
      return;
    }

    if (this.authService.hasValidSession()) {
      this.store.dispatch(AuthActions.validateSession());
    } else {
      this.store.dispatch(AuthActions.sessionInvalid());
    }
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeaderComponent } from './features/shared/components/containers/page-header/page-header.component';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth.service';
import { AuthActions } from './core/state/auth/auth.actions';
import { selectIsInitialized, selectIsLoading } from './core/state/auth/auth.reducers';

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
  private readonly isInitialized = this.store.selectSignal(selectIsInitialized);
  private readonly isLoading = this.store.selectSignal(selectIsLoading);

  ngOnInit(): void {
    if (this.isInitialized() || this.isLoading()) {
      return;
    }

    if (this.authService.hasValidSession()) {
      this.store.dispatch(AuthActions.validateSession());
    } else {
      this.store.dispatch(AuthActions.sessionInvalid());
    }
  }
}

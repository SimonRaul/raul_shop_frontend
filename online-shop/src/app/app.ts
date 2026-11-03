import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeaderComponent } from './features/shared/components/containers/page-header/page-header.component';
import { Store } from '@ngrx/store';
import { AuthService } from './features/auth/services/auth.service';
import { AuthActions } from './features/auth/state/auth.actions';
import { selectIsInitialized, selectIsLoading } from './features/auth/state/auth.reducers';

@Component({
  imports: [RouterOutlet, PageHeaderComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
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

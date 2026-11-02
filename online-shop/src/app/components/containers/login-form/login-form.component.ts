import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { UserLoginRequest } from '../../../features/shared/types/users.types';
import { LoginFormViewComponent } from '../../presentational/login-form-view/login-form-view.component';
import { Store } from '@ngrx/store';
import { selectAuthState } from '../../../core/state/auth/auth.reducers';
import { AuthActions } from '../../../core/state/auth/auth.actions';

@Component({
  imports: [LoginFormViewComponent],
  selector: 'app-login-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-login-form-view
    [errorMessage]="errorMessage()"
    (submittedClicked)="onLogin($event)"
  ></app-login-form-view>`,
})
export class LoginFormComponent {
  private readonly store = inject(Store);
  private readonly authState = this.store.selectSignal(selectAuthState);
  errorMessage = computed(() => this.authState().error);

  onLogin(formData: UserLoginRequest) {
    this.store.dispatch(AuthActions.login({ request: formData }));
  }
}

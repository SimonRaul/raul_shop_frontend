import { Component, computed, inject } from '@angular/core';
import { UserLoginRequest } from '../../../features/shared/types/users.types';
import { LoginFormViewComponent } from '../../presentational/login-form-view/login-form-view.component';
import { Store } from '@ngrx/store';
import { selectAuth } from '../../../features/shared/state/app.reducers';
import { AuthActions } from '../../../features/shared/state/app.actions';

@Component({
  imports: [LoginFormViewComponent],
  selector: 'app-login-form',
  template: `<app-login-form-view
    [errorMessage]="errorMessage()"
    (submittedClicked)="onLogin($event)"
  ></app-login-form-view>`,
})
export class LoginFormComponent {
  private store = inject(Store);
  private authState = this.store.selectSignal(selectAuth);
  errorMessage = computed(() => this.authState().error);

  onLogin(formData: UserLoginRequest) {
    this.store.dispatch(AuthActions.login({ request: formData }));
  }
}

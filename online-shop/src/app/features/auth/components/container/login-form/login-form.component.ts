import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { UserLoginRequest } from '../../../../user/types/users.types';
import { LoginFormViewComponent } from '../../presentational/login-form-view/login-form-view.component';
import { Store } from '@ngrx/store';
import { selectError, selectUser } from '../../../state/auth.reducers';
import { AuthActions } from '../../../state/auth.actions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [LoginFormViewComponent],
  selector: 'app-login-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-login-form-view
    [errorMessage]="errorMessage()"
    (submittedClicked)="onLogin($event)"
  ></app-login-form-view>`,
})
export class LoginFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly user = this.store.selectSignal(selectUser);
  readonly errorMessage = this.store.selectSignal(selectError);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private returnUrl = '/products';

  constructor() {
    effect(() => {
      if (this.user()) {
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
  }

  onLogin(formData: UserLoginRequest) {
    this.store.dispatch(AuthActions.login({ request: formData }));
  }
}

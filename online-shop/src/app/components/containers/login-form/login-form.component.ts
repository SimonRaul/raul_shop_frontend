import { Component, inject, signal } from '@angular/core';
import { UserLoginRequest } from '../../../features/shared/types/users.types';
import { LoginFormViewComponent } from '../../presentational/login-form-view/login-form-view.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  imports: [LoginFormViewComponent],
  selector: 'app-login-form',
  template: `<app-login-form-view
    [errorMessage]="errorMessage()"
    (submittedClicked)="onLogin($event)"
  ></app-login-form-view>`,
})
export class LoginFormComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  errorMessage = signal<string | null>(null);

  onLogin(formData: UserLoginRequest) {
    this.authService.login(formData).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.errorMessage.set('Login failed. Please try again.');
      },
    });
  }
}

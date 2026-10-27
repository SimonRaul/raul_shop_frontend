import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserLoginRequest } from '../../../features/shared/types/users.types';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login-form-view',
  styleUrl: './login-form-view.component.scss',
  templateUrl: './login-form-view.component.html',
})
export class LoginFormViewComponent {
  private readonly formBuilder = inject(FormBuilder);
  submittedClicked = output<UserLoginRequest>();
  errorMessage = input<string | null>(null);

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: [
      '',
      [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')],
    ],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.getRawValue() as UserLoginRequest;
      this.submittedClicked.emit(formData);
    }
  }
}

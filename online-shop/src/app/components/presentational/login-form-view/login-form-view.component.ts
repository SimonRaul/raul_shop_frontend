import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserLoginRequest } from '../../../features/shared/types/users.types';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  selector: 'app-login-form-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      [Validators.required, Validators.pattern(String.raw`^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$`)],
    ],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.getRawValue() as UserLoginRequest;
      this.submittedClicked.emit(formData);
    }
  }
}

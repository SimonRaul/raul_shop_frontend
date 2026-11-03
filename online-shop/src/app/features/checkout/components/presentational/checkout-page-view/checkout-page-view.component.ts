import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Address } from '../../../types/address.types';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  selector: 'app-checkout-page-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './checkout-page-view.component.scss',
  templateUrl: './checkout-page-view.component.html',
})
export class CheckoutPageViewComponent {
  checkoutClicked = output<Address>();
  private readonly formBuilder = inject(FormBuilder);
  isCheckedOut = input.required<boolean>();
  continueShoppingClicked = output<void>();
  isLoading = input.required<boolean>();
  errorMessage = input<string | null>(null);

  checkoutForm = this.formBuilder.nonNullable.group({
    country: ['', [Validators.required]],
    city: ['', [Validators.required]],
    county: ['', [Validators.required]],
    streetAddress: ['', [Validators.required]],
  });

  onCheckout() {
    if (this.checkoutForm.valid) {
      const address: Address = this.checkoutForm.getRawValue();
      this.checkoutClicked.emit(address);
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}

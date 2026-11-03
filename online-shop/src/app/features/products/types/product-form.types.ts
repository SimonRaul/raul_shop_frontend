import { FormControl, FormGroup } from '@angular/forms';

export type ProductForm = FormGroup<{
  name: FormControl<string>;
  description: FormControl<string>;
  price: FormControl<number>;
  weight: FormControl<number>;
  categoryId: FormControl<string>;
  imageUrl: FormControl<string>;
}>;

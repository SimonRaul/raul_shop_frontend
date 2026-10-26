import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsFormViewComponent } from './products-form-view.component';

describe('ProductsFormViewComponent', () => {
  let component: ProductsFormViewComponent;
  let fixture: ComponentFixture<ProductsFormViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsFormViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsFormViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

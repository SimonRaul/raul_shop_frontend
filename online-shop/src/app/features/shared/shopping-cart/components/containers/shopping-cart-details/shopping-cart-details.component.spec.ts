import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartDetailsComponent } from './shopping-cart-details.component';

describe('ShoppingCartDetailsComponent', () => {
  let component: ShoppingCartDetailsComponent;
  let fixture: ComponentFixture<ShoppingCartDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingCartDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

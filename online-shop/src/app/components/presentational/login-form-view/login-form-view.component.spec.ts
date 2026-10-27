import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormViewComponent } from './login-form-view.component';

describe('LoginFormViewComponent', () => {
  let component: LoginFormViewComponent;
  let fixture: ComponentFixture<LoginFormViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

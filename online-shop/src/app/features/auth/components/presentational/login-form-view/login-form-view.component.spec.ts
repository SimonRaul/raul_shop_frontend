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
    fixture.componentRef.setInput('errorMessage', null);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the form data when the form is valid and submitted', () => {
    const emittedData: any = {};
    component.submittedClicked.subscribe((data) => {
      Object.assign(emittedData, data);
    });

    component.loginForm.setValue({
      username: 'testuser',
      password: 'Password1',
    });
    component.onSubmit();
    expect(emittedData).toEqual({
      username: 'testuser',
      password: 'Password1',
    });
  });

  it('should not emit the form data when the form is invalid and submitted', () => {
    const emittedData: any = {};
    component.submittedClicked.subscribe((data) => {
      Object.assign(emittedData, data);
    });

    component.loginForm.setValue({
      username: '',
      password: '',
    });
    component.onSubmit();
    expect(emittedData).toEqual({});
  });

  it('should display the error message when provided', () => {
    const errorMessage = 'Invalid credentials';
    fixture.componentRef.setInput('errorMessage', errorMessage);
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('mat-error');
    expect(errorElement.textContent).toContain(errorMessage);
  });

  it('should not display the error message when not provided', () => {
    fixture.componentRef.setInput('errorMessage', null);
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('mat-error');
    expect(errorElement).toBeNull();
  });
});

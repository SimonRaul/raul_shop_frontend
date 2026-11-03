import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundPageViewComponent } from './not-found-page-view.component';

describe('NotFoundPageViewComponent', () => {
  let component: NotFoundPageViewComponent;
  let fixture: ComponentFixture<NotFoundPageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPageViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundPageViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeaderViewComponent } from './page-header-view.component';

describe('PageHeaderViewComponent', () => {
  let component: PageHeaderViewComponent;
  let fixture: ComponentFixture<PageHeaderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

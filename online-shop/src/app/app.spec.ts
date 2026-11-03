import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: Store,
          useValue: { selectSignal: () => null, dispatch: () => {} },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

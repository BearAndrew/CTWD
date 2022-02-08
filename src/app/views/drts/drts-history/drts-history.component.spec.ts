import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrtsHistoryComponent } from './drts-history.component';

describe('DrtsHistoryComponent', () => {
  let component: DrtsHistoryComponent;
  let fixture: ComponentFixture<DrtsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrtsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrtsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

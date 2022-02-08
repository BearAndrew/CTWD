import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrtsStatisticsComponent } from './drts-statistics.component';

describe('DrtsStatisticsComponent', () => {
  let component: DrtsStatisticsComponent;
  let fixture: ComponentFixture<DrtsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrtsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrtsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

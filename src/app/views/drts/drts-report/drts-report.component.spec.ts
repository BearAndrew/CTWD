import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrtsReportComponent } from './drts-report.component';

describe('DrtsReportComponent', () => {
  let component: DrtsReportComponent;
  let fixture: ComponentFixture<DrtsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrtsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrtsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

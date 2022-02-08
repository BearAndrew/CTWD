import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrtsComponent } from './drts.component';

describe('DrtsComponent', () => {
  let component: DrtsComponent;
  let fixture: ComponentFixture<DrtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

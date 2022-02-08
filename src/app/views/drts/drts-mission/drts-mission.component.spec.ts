import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrtsMissionComponent } from './drts-mission.component';

describe('DrtsMissionComponent', () => {
  let component: DrtsMissionComponent;
  let fixture: ComponentFixture<DrtsMissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrtsMissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrtsMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

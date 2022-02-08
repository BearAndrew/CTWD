import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrtsBulletinComponent } from './drts-bulletin.component';

describe('DrtsBulletinComponent', () => {
  let component: DrtsBulletinComponent;
  let fixture: ComponentFixture<DrtsBulletinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrtsBulletinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrtsBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

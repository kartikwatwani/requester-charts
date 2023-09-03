import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaywiseComponent } from './daywise.component';

describe('DaywiseComponent', () => {
  let component: DaywiseComponent;
  let fixture: ComponentFixture<DaywiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DaywiseComponent]
    });
    fixture = TestBed.createComponent(DaywiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

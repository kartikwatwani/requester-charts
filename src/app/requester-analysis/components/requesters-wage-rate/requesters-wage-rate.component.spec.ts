import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestersWageRateComponent } from './requesters-wage-rate.component';

describe('RequestersWageRateComponent', () => {
  let component: RequestersWageRateComponent;
  let fixture: ComponentFixture<RequestersWageRateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestersWageRateComponent]
    });
    fixture = TestBed.createComponent(RequestersWageRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

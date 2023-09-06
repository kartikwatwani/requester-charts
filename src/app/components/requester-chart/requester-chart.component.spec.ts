import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesterChartComponent } from './requester-chart.component';

describe('RequesterChartComponent', () => {
  let component: RequesterChartComponent;
  let fixture: ComponentFixture<RequesterChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequesterChartComponent]
    });
    fixture = TestBed.createComponent(RequesterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

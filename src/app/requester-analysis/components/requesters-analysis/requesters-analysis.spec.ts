import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestersAnalysis } from './requesters-analysis';

describe('RequestersAnalysis', () => {
  let component: RequestersAnalysis;
  let fixture: ComponentFixture<RequestersAnalysis>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestersAnalysis]
    });
    fixture = TestBed.createComponent(RequestersAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

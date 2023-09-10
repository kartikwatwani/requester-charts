import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestersBaseComponent } from './requesters-base.component';

describe('RequestersBaseComponent', () => {
  let component: RequestersBaseComponent;
  let fixture: ComponentFixture<RequestersBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestersBaseComponent]
    });
    fixture = TestBed.createComponent(RequestersBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

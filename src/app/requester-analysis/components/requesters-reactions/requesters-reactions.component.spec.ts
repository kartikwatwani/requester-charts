import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestersReactionsComponent } from './requesters-reactions.component';

describe('RequestersReactionsComponent', () => {
  let component: RequestersReactionsComponent;
  let fixture: ComponentFixture<RequestersReactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestersReactionsComponent]
    });
    fixture = TestBed.createComponent(RequestersReactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestersPresenceComponent } from './requesters-presence.component';

describe('RequestersPresenceComponent', () => {
  let component: RequestersPresenceComponent;
  let fixture: ComponentFixture<RequestersPresenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestersPresenceComponent]
    });
    fixture = TestBed.createComponent(RequestersPresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

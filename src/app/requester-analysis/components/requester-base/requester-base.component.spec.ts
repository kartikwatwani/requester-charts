import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesterBaseComponent } from './requester-base.component';

describe('RequesterBaseComponent', () => {
  let component: RequesterBaseComponent;
  let fixture: ComponentFixture<RequesterBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequesterBaseComponent]
    });
    fixture = TestBed.createComponent(RequesterBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

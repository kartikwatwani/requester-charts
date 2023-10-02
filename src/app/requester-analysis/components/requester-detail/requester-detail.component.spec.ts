import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesterDetailComponent } from './requester-detail.component';

describe('RequesterDetailComponent', () => {
  let component: RequesterDetailComponent;
  let fixture: ComponentFixture<RequesterDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequesterDetailComponent]
    });
    fixture = TestBed.createComponent(RequesterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

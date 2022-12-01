import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDisplayGetOfferComponent } from './admin-display-get-offer.component';

describe('AdminDisplayGetOfferComponent', () => {
  let component: AdminDisplayGetOfferComponent;
  let fixture: ComponentFixture<AdminDisplayGetOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDisplayGetOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDisplayGetOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

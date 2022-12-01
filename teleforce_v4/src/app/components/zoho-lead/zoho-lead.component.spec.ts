import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZohoLeadComponent } from './zoho-lead.component';

describe('ZohoLeadComponent', () => {
  let component: ZohoLeadComponent;
  let fixture: ComponentFixture<ZohoLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZohoLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZohoLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

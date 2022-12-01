import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErpLeadlistComponent } from './erp-leadlist.component';

describe('ErpLeadlistComponent', () => {
  let component: ErpLeadlistComponent;
  let fixture: ComponentFixture<ErpLeadlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErpLeadlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErpLeadlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

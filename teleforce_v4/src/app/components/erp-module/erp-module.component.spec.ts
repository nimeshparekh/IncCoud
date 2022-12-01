import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErpModuleComponent } from './erp-module.component';

describe('ErpModuleComponent', () => {
  let component: ErpModuleComponent;
  let fixture: ComponentFixture<ErpModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErpModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErpModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

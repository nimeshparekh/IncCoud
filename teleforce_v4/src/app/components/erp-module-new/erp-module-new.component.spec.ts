import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErpModuleNewComponent } from './erp-module-new.component';

describe('ErpModuleNewComponent', () => {
  let component: ErpModuleNewComponent;
  let fixture: ComponentFixture<ErpModuleNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErpModuleNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErpModuleNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

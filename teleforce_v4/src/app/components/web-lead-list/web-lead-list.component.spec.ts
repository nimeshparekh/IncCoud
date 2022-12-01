import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebLeadListComponent } from './web-lead-list.component';

describe('WebLeadListComponent', () => {
  let component: WebLeadListComponent;
  let fixture: ComponentFixture<WebLeadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebLeadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebLeadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

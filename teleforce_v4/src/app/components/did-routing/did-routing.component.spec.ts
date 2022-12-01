import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DidRoutingComponent } from './did-routing.component';

describe('DidRoutingComponent', () => {
  let component: DidRoutingComponent;
  let fixture: ComponentFixture<DidRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DidRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DidRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

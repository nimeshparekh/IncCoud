import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorTrakingComponent } from './visitor-traking.component';

describe('VisitorTrakingComponent', () => {
  let component: VisitorTrakingComponent;
  let fixture: ComponentFixture<VisitorTrakingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorTrakingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorTrakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

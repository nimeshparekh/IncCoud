import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutesAssignResponseComponent } from './minutes-assign-response.component';

describe('MinutesAssignResponseComponent', () => {
  let component: MinutesAssignResponseComponent;
  let fixture: ComponentFixture<MinutesAssignResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinutesAssignResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinutesAssignResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

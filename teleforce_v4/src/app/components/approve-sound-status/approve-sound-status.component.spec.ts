import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveSoundStatusComponent } from './approve-sound-status.component';

describe('ApproveSoundStatusComponent', () => {
  let component: ApproveSoundStatusComponent;
  let fixture: ComponentFixture<ApproveSoundStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveSoundStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveSoundStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

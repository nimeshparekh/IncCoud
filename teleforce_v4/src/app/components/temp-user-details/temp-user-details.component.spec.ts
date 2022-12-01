import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempUserDetailsComponent } from './temp-user-details.component';

describe('TempUserDetailsComponent', () => {
  let component: TempUserDetailsComponent;
  let fixture: ComponentFixture<TempUserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempUserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaychanelComponent } from './displaychanel.component';

describe('DisplaychanelComponent', () => {
  let component: DisplaychanelComponent;
  let fixture: ComponentFixture<DisplaychanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaychanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaychanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

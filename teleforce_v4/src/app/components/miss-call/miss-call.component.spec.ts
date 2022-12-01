import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissCallComponent } from './miss-call.component';

describe('MissCallComponent', () => {
  let component: MissCallComponent;
  let fixture: ComponentFixture<MissCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

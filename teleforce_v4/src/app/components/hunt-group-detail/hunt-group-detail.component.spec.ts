import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HuntGroupDetailComponent } from './hunt-group-detail.component';

describe('HuntGroupDetailComponent', () => {
  let component: HuntGroupDetailComponent;
  let fixture: ComponentFixture<HuntGroupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HuntGroupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HuntGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsGenerationComponent } from './leads-generation.component';

describe('LeadsGenerationComponent', () => {
  let component: LeadsGenerationComponent;
  let fixture: ComponentFixture<LeadsGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBlockNumberComponent } from './create-block-number.component';

describe('CreateBlockNumberComponent', () => {
  let component: CreateBlockNumberComponent;
  let fixture: ComponentFixture<CreateBlockNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBlockNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBlockNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDidConfigComponent } from './edit-did-config.component';

describe('EditDidConfigComponent', () => {
  let component: EditDidConfigComponent;
  let fixture: ComponentFixture<EditDidConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDidConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDidConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

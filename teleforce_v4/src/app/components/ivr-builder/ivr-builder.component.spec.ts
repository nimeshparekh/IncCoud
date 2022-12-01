import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IvrBuilderComponent } from './ivr-builder.component';

describe('IvrBuilderComponent', () => {
  let component: IvrBuilderComponent;
  let fixture: ComponentFixture<IvrBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IvrBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IvrBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

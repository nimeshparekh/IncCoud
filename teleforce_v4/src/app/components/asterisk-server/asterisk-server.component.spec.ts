import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsteriskServerComponent } from './asterisk-server.component';

describe('AsteriskServerComponent', () => {
  let component: AsteriskServerComponent;
  let fixture: ComponentFixture<AsteriskServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsteriskServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsteriskServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

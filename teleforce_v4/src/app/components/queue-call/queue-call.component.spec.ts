import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueCallComponent } from './queue-call.component';

describe('QueueCallComponent', () => {
  let component: QueueCallComponent;
  let fixture: ComponentFixture<QueueCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesAvailabilityComponent } from './resources-availability.component';

describe('ResourcesAvailabilityComponent', () => {
  let component: ResourcesAvailabilityComponent;
  let fixture: ComponentFixture<ResourcesAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcesAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

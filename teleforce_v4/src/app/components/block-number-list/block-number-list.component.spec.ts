import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockNumberListComponent } from './block-number-list.component';

describe('BlockNumberListComponent', () => {
  let component: BlockNumberListComponent;
  let fixture: ComponentFixture<BlockNumberListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockNumberListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockNumberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

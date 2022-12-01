import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChennallistComponent } from './create-chennallist.component';

describe('CreateChennallistComponent', () => {
  let component: CreateChennallistComponent;
  let fixture: ComponentFixture<CreateChennallistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateChennallistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChennallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

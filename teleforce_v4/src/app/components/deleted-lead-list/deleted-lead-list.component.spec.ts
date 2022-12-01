import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedLeadListComponent } from './deleted-lead-list.component';

describe('DeletedLeadListComponent', () => {
  let component: DeletedLeadListComponent;
  let fixture: ComponentFixture<DeletedLeadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletedLeadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedLeadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

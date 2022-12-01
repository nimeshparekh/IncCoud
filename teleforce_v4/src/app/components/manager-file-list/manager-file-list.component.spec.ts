import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerFileListComponent } from './manager-file-list.component';

describe('ManagerFileListComponent', () => {
  let component: ManagerFileListComponent;
  let fixture: ComponentFixture<ManagerFileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerFileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopySendEmailComponent } from './copy-send-email.component';

describe('CopySendEmailComponent', () => {
  let component: CopySendEmailComponent;
  let fixture: ComponentFixture<CopySendEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopySendEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopySendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

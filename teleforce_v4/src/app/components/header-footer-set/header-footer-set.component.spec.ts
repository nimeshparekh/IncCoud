import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFooterSetComponent } from './header-footer-set.component';

describe('HeaderFooterSetComponent', () => {
  let component: HeaderFooterSetComponent;
  let fixture: ComponentFixture<HeaderFooterSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderFooterSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderFooterSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

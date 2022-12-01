import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZohoUserMapComponent } from './zoho-user-map.component';

describe('ZohoUserMapComponent', () => {
  let component: ZohoUserMapComponent;
  let fixture: ComponentFixture<ZohoUserMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZohoUserMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZohoUserMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

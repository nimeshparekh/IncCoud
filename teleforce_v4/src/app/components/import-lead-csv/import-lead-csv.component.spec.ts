import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportLeadCsvComponent } from './import-lead-csv.component';

describe('ImportLeadCsvComponent', () => {
  let component: ImportLeadCsvComponent;
  let fixture: ComponentFixture<ImportLeadCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportLeadCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportLeadCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

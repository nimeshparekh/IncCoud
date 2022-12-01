import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceMailComponent } from './voice-mail.component';

describe('VoiceMailComponent', () => {
  let component: VoiceMailComponent;
  let fixture: ComponentFixture<VoiceMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoiceMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

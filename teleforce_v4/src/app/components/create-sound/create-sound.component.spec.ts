import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSoundComponent } from './create-sound.component';

describe('CreateSoundComponent', () => {
  let component: CreateSoundComponent;
  let fixture: ComponentFixture<CreateSoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

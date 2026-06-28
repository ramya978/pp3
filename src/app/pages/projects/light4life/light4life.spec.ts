import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Light4life } from './light4life';

describe('Light4life', () => {
  let component: Light4life;
  let fixture: ComponentFixture<Light4life>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Light4life],
    }).compileComponents();

    fixture = TestBed.createComponent(Light4life);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

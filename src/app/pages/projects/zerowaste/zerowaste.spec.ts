import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zerowaste } from './zerowaste';

describe('Zerowaste', () => {
  let component: Zerowaste;
  let fixture: ComponentFixture<Zerowaste>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zerowaste],
    }).compileComponents();

    fixture = TestBed.createComponent(Zerowaste);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

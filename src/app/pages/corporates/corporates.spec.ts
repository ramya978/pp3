import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Corporates } from './corporates';

describe('Corporates', () => {
  let component: Corporates;
  let fixture: ComponentFixture<Corporates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Corporates],
    }).compileComponents();

    fixture = TestBed.createComponent(Corporates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

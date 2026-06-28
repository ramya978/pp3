import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Missionmilliontrees } from './missionmilliontrees';

describe('Missionmilliontrees', () => {
  let component: Missionmilliontrees;
  let fixture: ComponentFixture<Missionmilliontrees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Missionmilliontrees],
    }).compileComponents();

    fixture = TestBed.createComponent(Missionmilliontrees);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

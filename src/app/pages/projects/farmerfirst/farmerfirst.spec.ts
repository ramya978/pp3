import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Farmerfirst } from './farmerfirst';

describe('Farmerfirst', () => {
  let component: Farmerfirst;
  let fixture: ComponentFixture<Farmerfirst>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Farmerfirst],
    }).compileComponents();

    fixture = TestBed.createComponent(Farmerfirst);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

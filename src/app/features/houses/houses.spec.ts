import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Houses } from './houses';

describe('Houses', () => {
  let component: Houses;
  let fixture: ComponentFixture<Houses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Houses],
    }).compileComponents();

    fixture = TestBed.createComponent(Houses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

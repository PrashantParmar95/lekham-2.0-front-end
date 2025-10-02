import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lekh } from './lekh';

describe('Lekh', () => {
  let component: Lekh;
  let fixture: ComponentFixture<Lekh>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lekh]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lekh);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

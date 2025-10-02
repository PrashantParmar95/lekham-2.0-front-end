import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLekh } from './add-lekh';

describe('AddLekh', () => {
  let component: AddLekh;
  let fixture: ComponentFixture<AddLekh>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLekh]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLekh);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

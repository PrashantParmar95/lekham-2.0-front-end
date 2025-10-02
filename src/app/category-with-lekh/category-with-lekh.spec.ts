import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryWithLekh } from './category-with-lekh';

describe('CategoryWithLekh', () => {
  let component: CategoryWithLekh;
  let fixture: ComponentFixture<CategoryWithLekh>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryWithLekh]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryWithLekh);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentWriter } from './content-writer';

describe('ContentWriter', () => {
  let component: ContentWriter;
  let fixture: ComponentFixture<ContentWriter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentWriter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentWriter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

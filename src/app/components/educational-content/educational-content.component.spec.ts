import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalContentComponent } from './educational-content.component';

describe('EducationalContentComponent', () => {
  let component: EducationalContentComponent;
  let fixture: ComponentFixture<EducationalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationalContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

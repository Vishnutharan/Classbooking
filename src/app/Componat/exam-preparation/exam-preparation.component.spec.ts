import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamPreparationComponent } from './exam-preparation.component';

describe('ExamPreparationComponent', () => {
  let component: ExamPreparationComponent;
  let fixture: ComponentFixture<ExamPreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamPreparationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

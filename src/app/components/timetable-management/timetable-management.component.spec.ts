import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableManagementComponent } from './timetable-management.component';

describe('TimetableManagementComponent', () => {
  let component: TimetableManagementComponent;
  let fixture: ComponentFixture<TimetableManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetableManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimetableManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

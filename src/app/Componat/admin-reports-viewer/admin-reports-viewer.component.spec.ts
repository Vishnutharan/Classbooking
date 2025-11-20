import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportsViewerComponent } from './admin-reports-viewer.component';

describe('AdminReportsViewerComponent', () => {
  let component: AdminReportsViewerComponent;
  let fixture: ComponentFixture<AdminReportsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReportsViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReportsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsToastComponent } from './notifications-toast.component';

describe('NotificationsToastComponent', () => {
  let component: NotificationsToastComponent;
  let fixture: ComponentFixture<NotificationsToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsToastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

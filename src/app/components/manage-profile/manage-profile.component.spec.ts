import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProfileGenericComponent } from './manage-profile-generic.component';

describe('ManageProfileGenericComponent', () => {
  let component: ManageProfileGenericComponent;
  let fixture: ComponentFixture<ManageProfileGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProfileGenericComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProfileGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

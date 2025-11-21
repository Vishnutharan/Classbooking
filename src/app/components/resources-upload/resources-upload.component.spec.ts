import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesUploadComponent } from './resources-upload.component';

describe('ResourcesUploadComponent', () => {
  let component: ResourcesUploadComponent;
  let fixture: ComponentFixture<ResourcesUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

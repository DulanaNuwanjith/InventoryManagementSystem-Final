import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewAssetComponent } from './user-view-asset.component';

describe('UserViewAssetComponent', () => {
  let component: UserViewAssetComponent;
  let fixture: ComponentFixture<UserViewAssetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserViewAssetComponent]
    });
    fixture = TestBed.createComponent(UserViewAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

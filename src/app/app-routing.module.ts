import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AssetTypeManagementComponent } from './asset-type-management/asset-type-management.component';
import { AssetManagementComponent } from './asset-management/asset-management.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserProfileManagementComponent } from './user-profile-management/user-profile-management.component';
import { UserChangePasswordComponent } from './user-change-password/user-change-password.component';
import { UserViewAssetComponent } from './user-view-asset/user-view-asset.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AuthGuard } from './_auth/auth.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AssetPopupComponent } from './asset-popup/asset-popup.component';
import { UserAuthService } from './_services/user-auth.service';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { AvailableAssetsListComponent } from './available-assets-list/available-assets-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path: 'registration',
    canActivate: [AuthGuard],
    component: UserRegistrationComponent
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    component: UserLoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
  },
  {
    path: 'asset-type-management',
    component: AssetTypeManagementComponent
  },
  {
    path: 'asset-management',
    component: AssetManagementComponent
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'user-profile-management',
    component: UserProfileManagementComponent
  },
  {
    path: 'user-change-password',
    component: UserChangePasswordComponent
  },
  {
    path: 'user-view-asset',
    component: UserViewAssetComponent
  },
  {
    path: 'nav-bar',
    component: NavBarComponent
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent
  },
  {
    path: 'asset-popup',
    component: AssetPopupComponent
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent
  },
  {
    path: 'available-assets-list',
    component: AvailableAssetsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private auth: UserAuthService) { }
}

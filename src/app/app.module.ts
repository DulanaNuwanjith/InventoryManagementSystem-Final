import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { HomePageComponent } from './home-page/home-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AssetTypeManagementComponent } from './asset-type-management/asset-type-management.component';
import { AssetManagementComponent } from './asset-management/asset-management.component';
import { UserProfileManagementComponent } from './user-profile-management/user-profile-management.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserChangePasswordComponent } from './user-change-password/user-change-password.component';
import { UserViewAssetComponent } from './user-view-asset/user-view-asset.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { UserService } from './_services/user.service';
import { AuthInterceptor } from './_auth/auth.interceptor';
import { AuthGuard } from './_auth/auth.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssetTypeService } from './_services/asset-type.service';
import { AssetPopupComponent } from './asset-popup/asset-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AvailableAssetsListComponent } from './available-assets-list/available-assets-list.component';

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserRegistrationComponent,
    HomePageComponent,
    DashboardComponent,
    UserManagementComponent,
    AssetTypeManagementComponent,
    AssetManagementComponent,
    UserProfileManagementComponent,
    UserDashboardComponent,
    UserChangePasswordComponent,
    UserViewAssetComponent,
    NavBarComponent,
    ForbiddenComponent,
    AssetPopupComponent,
    DeleteConfirmationDialogComponent,
    TermsAndConditionsComponent,
    AvailableAssetsListComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    AuthGuard,
    AssetTypeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

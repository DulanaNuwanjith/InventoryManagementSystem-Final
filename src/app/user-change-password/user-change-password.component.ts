import { Component } from '@angular/core';
import { UserAuthService } from '../_services/user-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.css']
})
export class UserChangePasswordComponent {

  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: UserAuthService, private snackBar: MatSnackBar) { }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New and confirm passwords do not match.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'New password must have at least 6 characters.';
      return;
    }

    this.authService.changePassword(this.oldPassword, this.newPassword)
      .subscribe(
        (response) => {
          this.errorMessage = '';
          this.clearForm();

          this.snackBar.open('Successfully updated password', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
        },
        (error) => {
          console.log(error);
          if (error && error.status === 401) {
            this.errorMessage = 'Wrong existing password.';
          } else if (error && error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Wrong existing password.';
          }
        }
      );
  }

  clearForm() {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

}

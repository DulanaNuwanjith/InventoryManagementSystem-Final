import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile-management',
  templateUrl: './user-profile-management.component.html',
  styleUrls: ['./user-profile-management.component.css']
})
export class UserProfileManagementComponent implements OnInit {

  profileForm: FormGroup;
  userDetails: any | null = null;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private snackBar: MatSnackBar) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      phoneno: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    });
  }

  ngOnInit() {
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.userService.getCurrentUserDetails().subscribe(
      (data: any) => {
        this.userDetails = data;
        this.profileForm.patchValue({
          firstName: this.userDetails?.firstName || '',
          lastName: this.userDetails?.lastName || '',
          phoneno: this.userDetails?.phoneno || ''
        });
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  updateProfile() {
    if (this.profileForm.valid) {
      const updatedData = this.profileForm.value;

      this.userService.updateUserProfile(updatedData).subscribe(
        (response: any) => {
          console.log('Profile updated successfully.');
          this.loadUserDetails();

          this.snackBar.open('Profile updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
        },
        (error) => {
          console.error('Error updating user profile:', error);
        }
      );
    } else { }
  }


}

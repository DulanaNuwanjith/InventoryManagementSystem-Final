import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  registrationForm: FormGroup;

  userData = {
    firstName: '',
    lastName: '',
    phoneno: '',
    username: '',
    email: '',
    password: '',
  };

  constructor(private userService: UserService, private snackBar: MatSnackBar, private fb: FormBuilder, private router: Router) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(10), this.noNumbersValidator]],
      lastName: ['', [Validators.required, this.noNumbersValidator]],
      phoneno: ['', [Validators.required, this.onlyNumbersValidator, Validators.pattern(/^\d{9}$/)]],
      username: ['', [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(6)]],
    });
  }

  ngOnInit() {

  }

  onlyNumbersValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (value && !/^\d+$/.test(value)) {
      return { 'onlyNumbers': true };
    }
    return null;
  }

  noNumbersValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (value && /\d/.test(value)) {
      return { 'noNumbers': true };
    }
    return null;
  }

  registerUser() {
    if (this.registrationForm.invalid) {
      return;
    }

    const userData = this.registrationForm.value;
    this.userService.register(userData).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        this.registrationForm.reset();
        this.snackBar.open('Registration successful', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed:', error);
        this.snackBar.open('Registration failed', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'error-snackbar',
        });
      }
    );
  }
}

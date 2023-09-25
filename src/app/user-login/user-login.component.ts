import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})

export class UserLoginComponent implements OnInit {
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void { }

  login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        if (response && response.roles) {
          this.userAuthService.setRoles(response.roles);
          this.userAuthService.setToken(response.token);
          this.userAuthService.login();

          const roles = response.roles[0];
          if (roles === 'ROLE_ADMIN') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/user-dashboard']);
          }

          this.snackBar.open('Logged in successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        } else {
          console.log("Response structure is invalid. Missing 'roles'.");
        }
      },
      (error) => {
        console.log(error);
        this.errorMessage = 'Login failed. Please check your username and password.';
      }
    );
  }

}

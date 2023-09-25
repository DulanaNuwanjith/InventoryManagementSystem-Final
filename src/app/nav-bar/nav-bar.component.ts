import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {
  userData: any;
  isAuthenticated: boolean;
  auth$: Subscription = new Subscription;

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    public userService: UserService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar

  ) {
    this.isAuthenticated = false;
  }

  ngOnInit(): void {
    this.isAuthenticated = this.userAuthService.isLoggedIn();
    console.log("isLoggedIN", this.userAuthService.isLoggedIn());
    this.setIsAuthenticated();
  }

  ngOnDestroy(): void {
    this.auth$ && this.auth$.unsubscribe();
  }

  setIsAuthenticated(): void {
    this.auth$ = this.userAuthService.isAuthenticated.subscribe(res => {
      this.isAuthenticated = res;
      this.cdr.detectChanges();
    })
  }

  public isLoggedIn(): boolean {
    return this.userAuthService.isLoggedIn();
  }

  public logout() {
    console.log('Logout function called');
    this.userAuthService.logout();
    this.userAuthService.clear();
    this.isAuthenticated = this.userAuthService.isLoggedIn();
    console.log("isLoggedIN", this.userAuthService.isLoggedIn());

    this.cdr.detectChanges();

    this.router.navigate(['/home']);
    this.snackBar.open('Successfully logged out', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }


}

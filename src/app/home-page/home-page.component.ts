import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UserAuthService } from '../_services/user-auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {

  isAuthenticated: boolean = false;
  authState$: Subscription = new Subscription();

  constructor(private userAuthService: UserAuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.isAuthenticated = this.userAuthService.isLoggedIn();
    this.setAuthStateChange();
  }

  ngOnDestroy(): void {
    this.authState$.unsubscribe();
  }

  setAuthStateChange() {
    this.authState$ = this.userAuthService.getAuthState()
      .subscribe(state => {
        this.isAuthenticated = state;
        this.cdr.detectChanges();
      });
  }

}

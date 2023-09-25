import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  const executeGuard: CanActivateFn = (...guardParameters) => {
    TestBed.configureTestingModule({
      providers: [AuthGuard],
    });

    authGuard = TestBed.inject(AuthGuard);
    return authGuard.canActivate(...guardParameters) as boolean;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

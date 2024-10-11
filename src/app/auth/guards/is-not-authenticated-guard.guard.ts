import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces';

export const isNotAuthenticatedGuardGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);


  if(authService.authStatus() === AuthStatus.notAuthenticated){
    return true;
  }


  router.navigateByUrl('/dashboard')
  return false;

};

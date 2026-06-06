import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthApi } from '../../services/auth-api';

export const authGuard: CanActivateFn = (route, state) => {
  const authApi = inject(AuthApi);
  const router = inject(Router);

  // Check if user is logged in/has token to allow navigation
  if (authApi.token() !== null) {
    return true;
  } else {
    return router.createUrlTree(['/login']); 
  }
};

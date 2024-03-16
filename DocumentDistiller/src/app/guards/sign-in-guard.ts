import {Router} from "@angular/router";
import {inject} from "@angular/core";
import {TokenService} from "../services/token.service";

export const signInGuard = async () => {
  const userService = inject(TokenService);
  const router = inject(Router);

  // If the user is not authenticated, allow access
  if (!userService.isAuthenticated()) {
    return true;
  }

  // If the user is authenticated, redirect to the dashboard
  return router.parseUrl('/dashboard');
};

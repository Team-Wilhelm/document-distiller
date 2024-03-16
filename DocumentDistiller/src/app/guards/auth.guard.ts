import {Router} from "@angular/router";
import {inject} from "@angular/core";
import {TokenService} from "../services/token.service";

export const authGuard = async () => {
  const userService = inject(TokenService);
  const router = inject(Router);

  // If the user is authenticated, allow access
  if (userService.isAuthenticated()) {
    return true;
  }

  // Redirect to the login page
  return router.parseUrl('/auth');
};

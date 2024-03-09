import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TokenService} from "../services/token.service";
import {LoginDto} from "../models/login-dto.interface";

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private tokenService: TokenService) {
  }

  async login() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginDto = this.loginForm.value as LoginDto;
    await this.tokenService.login(loginDto);
    await this.router.navigate(['/dashboard']);
  }

  register() {
    if (this.loginForm.invalid) {
      return;
    }

    console.log('register');
  }
}

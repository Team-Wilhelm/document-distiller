import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent {
  title = 'DocumentDistiller';
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router) {
  }

  login() {
    this.router.navigate(['/file-upload']);

    if (this.loginForm.invalid) {
      return;
    }

    console.log('login');
  }

  register() {
    if (this.loginForm.invalid) {
      return;
    }

    console.log('register');
  }
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthPageComponent} from "./auth-page.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AuthPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }

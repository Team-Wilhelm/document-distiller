import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TokenService} from "./token.service";
import {JWT_OPTIONS, JwtHelperService} from "@auth0/angular-jwt";
import {AuthHttpInterceptor} from "../interceptors/auth.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FileService} from "./file.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    JwtHelperService,
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    TokenService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    },
    FileService
  ]
})
export class ServiceModule { }

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {JwtHelperService} from "@auth0/angular-jwt";
import {firstValueFrom} from "rxjs";
import {LoginDto} from "../models/login-dto.interface";
import {environment} from "../../../environment/environment";

@Injectable()
export class TokenService {
  private readonly storage: Storage = window.sessionStorage;

  constructor(public jwtHelper: JwtHelperService, private httpClient: HttpClient) {
  }

  setToken(token: string) {
    this.storage.setItem("token", token);
  }

  getToken() {
    return this.storage.getItem("token");
  }

  clearToken() {
    this.storage.removeItem("token");
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !this.jwtHelper.isTokenExpired(token);
  }

  public async login(loginDto: LoginDto) {
    try {
      const request = this.httpClient.post<any>(environment.baseUrl + '/auth/login', loginDto);
      const response = await firstValueFrom(request);
      const token = response.token;
      this.setToken(token);
    } catch (e : any) {
      if (e.status === 400) {
        throw new Error('Invalid credentials');
      }else if(e.status === 500){
        throw new Error('Something went wrong');
      }
    }
  }

  public logout() {
    this.clearToken();
  }
}

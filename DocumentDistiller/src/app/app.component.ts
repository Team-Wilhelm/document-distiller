import {Component, OnInit} from '@angular/core';
import {initFlowbite} from "flowbite";
import {TokenService} from "./services/token.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'DocumentDistiller';

  constructor(protected tokenService: TokenService, private router: Router) {}

  ngOnInit() {
    initFlowbite();
  }

 async logout() {
    this.tokenService.logout();
    await this.router.navigate(['/auth']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  createNewProject() {
    //TODO: implement
    // open dialog to create new project and create project on save
  }
}

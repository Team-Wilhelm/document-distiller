import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenService} from "./services/token.service";
import {Router} from "@angular/router";
import {ProjectService} from "./services/project.service";
import {Subscription} from "rxjs";
import {ProjectStore} from "./stores/project.store";
import {MenuItem} from "./models/menu-item.interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'DocumentDistiller';
  projectSubscription: Subscription | undefined;
  projectMenuItems: MenuItem[] = [];

  constructor(protected tokenService: TokenService,
              private router: Router,
              public projectService: ProjectService,
              protected projectStore: ProjectStore) {}

  ngOnInit() {
    this.projectSubscription = this.projectStore
      .getProjectsObservable().subscribe(projects => {
        this.projectMenuItems = projects.map(project => {
          return {
            title: project.name,
            children: [],
            id: project.id,
            onClick: () => console.log('clicked on project: ', project.name)
          } as MenuItem;
        });
    });
  }

  ngOnDestroy() {
    this.projectSubscription?.unsubscribe();
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

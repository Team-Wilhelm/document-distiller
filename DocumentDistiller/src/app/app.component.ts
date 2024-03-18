import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenService} from "./services/token.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {ProjectStore} from "./stores/project.store";
import {MenuItem} from "./models/menu-item.interface";
import {DialogStore} from "./stores/dialog.store";
import {CRUD} from "./dashboard/constants/FrontendConstants";
import {ProjectService} from "./services/project.service";

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
              protected projectStore: ProjectStore,
              private projectService: ProjectService,
              private dialogStore: DialogStore) {
  }

  ngOnInit() {
    this.projectSubscription = this.projectStore
      .getProjectsObservable().subscribe(projects => {
        this.projectMenuItems = projects.map(project => {
          return {
            title: project.name,
            children: [],
            id: project.id,
            onClick: () => {
              this.dialogStore.openProjectDialog(CRUD.Read);
              this.projectStore.setSelectedProject(project);
            },
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
    this.dialogStore.openProjectDialog(CRUD.Create);
  }
}

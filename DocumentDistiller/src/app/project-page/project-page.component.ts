import {Component, OnInit} from '@angular/core';
import {Project} from "../models/project";
import {ProjectService} from "../services/project.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
})
export class ProjectPageComponent implements OnInit {
  project: Project | undefined;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const projectId = params['id'];
      if (projectId) {
        this.projectService.getProject(projectId).then(project => {
          this.project = project;
        }).catch(error => console.error(error));
      }
    });
  }
}

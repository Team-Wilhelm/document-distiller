import {Component} from '@angular/core';
import {ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
})
export class MyProjectsComponent {

  constructor(public projectService: ProjectService){

  }
}

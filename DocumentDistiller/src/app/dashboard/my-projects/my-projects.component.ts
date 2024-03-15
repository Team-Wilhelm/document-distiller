import {Component} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {ProjectStore} from "../../stores/project.store";

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
})
export class MyProjectsComponent {

  constructor(protected projectStore: ProjectStore){

  }
}

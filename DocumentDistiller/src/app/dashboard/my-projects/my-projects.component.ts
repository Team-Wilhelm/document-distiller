import { Component } from '@angular/core';
import {ProjectCardComponent} from "../project-card/project-card.component";

@Component({
  selector: 'app-my-projects',
  standalone: true,
  imports: [
    ProjectCardComponent
  ],
  templateUrl: './my-projects.component.html',
})
export class MyProjectsComponent {

}

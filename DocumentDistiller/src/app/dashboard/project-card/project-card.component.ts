import {Component, Input} from '@angular/core';
import {Project} from "../../models/project";
import {ProjectStore} from "../../stores/project.store";
import {DialogStore} from "../../stores/dialog.store";
import {CRUD} from "../constants/FrontendConstants";

@Component({
  selector: 'app-project-card',
  template: `
    <div class="flex flex-col justify-between bg-background-card p-5 rounded-lg shadow-md gap-10 h-full cursor-pointer"
         (click)="projectClicked()">
      <div class="flex flex-col">
        <h3 class="text-xl font-bold">{{ project.name }}</h3>
        <p>{{ project.createdAt | date: 'longDate' }}</p>
      </div>
      <p class="flex-grow"> {{ project.description | truncate:150 }}</p>
    </div>`
})
export class ProjectCardComponent {
  @Input() project!: Project;

  constructor(private projectStore: ProjectStore,
              private dialogStore: DialogStore) {
  }

  projectClicked() {
    this.projectStore.setSelectedProject(this.project);
    this.dialogStore.openProjectDialog(CRUD.Read);
  }
}

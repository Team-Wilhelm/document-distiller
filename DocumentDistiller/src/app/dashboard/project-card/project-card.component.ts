import {Component, Input} from '@angular/core';
import {Project} from "../../models/project";
import {Router} from "@angular/router";

@Component({
  selector: 'app-project-card',
  template: `
    <div class="flex flex-col justify-between bg-background-card p-5 rounded-lg shadow-md gap-10">
      <h3 class="text-xl font-bold">{{ project.name }}</h3>
      <p>Created: {{ project.createdAt | date: 'longDate' }}</p>
      <p *ngIf="project.description">{{ project.description | truncate:150:true }}</p>
      <p (click)="goToProjectPage(project.id)" class="text-blue-600 hover:underline">View Project</p>
    </div>`
})
export class ProjectCardComponent {
  @Input() project!: Project;

  constructor(public router: Router) {
  }

  goToProjectPage(id: string) {
    this.router.navigate(['/project-page', id]);
  }
}

import {Injectable} from "@angular/core";
import {Project} from "../models/project";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProjectStore {
  projects: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  selectedProject: BehaviorSubject<Project | null> = new BehaviorSubject<Project | null>(null);

  constructor() {
  }

  setProjects(projects: Project[]) {
    this.projects.next(projects);
  }

  getProjectsObservable() {
    return this.projects.asObservable();
  }

  getProjectsValue() {
    return this.projects.value;
  }

  setSelectedProject(project: Project | null) {
    this.selectedProject.next(project);
  }

  getSelectedProjectObservable() {
    return this.selectedProject.asObservable();
  }

  getSelectedProject() {
    return this.selectedProject.value;
  }
}

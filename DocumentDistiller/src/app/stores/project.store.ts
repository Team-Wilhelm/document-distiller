import {Injectable} from "@angular/core";
import {Project} from "../models/project";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProjectStore {
  projects: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

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
}
